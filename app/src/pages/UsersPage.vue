<template>
  <div>
    <AppHeader />

    <h1>Пользователи</h1>

    <!-- Кнопка открытия модального окна добавления -->
    <q-btn
      label="Добавить пользователя"
      color="primary"
      @click="showAddModal = true"
    />

    <!-- Таблица пользователей -->
    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="table-container"
    >
      <template v-slot:body-cell-actions="props">
        <q-btn
          color="primary"
          label="Изменить"
          @click="startEditingWithModal(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteUserHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <!-- Модальное окно для добавления пользователя -->
    <q-dialog v-model="showAddModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавить пользователя</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newUser.name" label="Имя" filled required />
          <q-input v-model="newUser.surname" label="Фамилия" filled required />
          <q-input v-model="newUser.second_name" label="Отчество" filled />
          <q-input v-model="newUser.login" label="Логин" filled required />
          <q-input
            v-model="newUser.password"
            label="Пароль"
            type="password"
            filled
            required
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отмена"
            color="negative"
            @click="showAddModal = false"
          />
          <q-btn flat label="Добавить" color="primary" @click="handleCreate" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для редактирования пользователя -->
    <q-dialog v-model="showEditModal">
      <q-card v-if="editedUser">
        <q-card-section>
          <div class="text-h6">Изменить пользователя</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editedUser.name" label="Имя" filled required />
          <q-input
            v-model="editedUser.surname"
            label="Фамилия"
            filled
            required
          />
          <q-input v-model="editedUser.second_name" label="Отчество" filled />
          <q-input v-model="editedUser.login" label="Логин" filled required />
          <q-input
            v-model="editedUser.password"
            label="Пароль"
            type="text"
            filled
            required
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="negative" @click="cancelEdit" />
          <q-btn flat label="Сохранить" color="primary" @click="handleUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from 'components/AppHeader.vue';
import { usersColumns } from 'src/pages/columns/usersColumns';
import axiosInstance from 'src/api/axiosInstance';

import { useCreateUser } from 'src/pages/composables/users/useCreateUser';
import { useUpdateUser } from 'src/pages/composables/users/useUpdateUser';
import { useDeleteUser } from 'src/pages/composables/users/useDeleteUser';
import { User } from './types/User';

const columns = usersColumns;

const users = ref<User[]>([]);
const showAddModal = ref(false);
const showEditModal = ref(false);

interface UserData {
  id?: number;
  name: string;
  surname: string;
  second_name: string;
  login: string;
  password: string;
}

const loadUsers = async () => {
  try {
    const allUsers = await getUsers();
    users.value = allUsers.filter((user) => user.deleted_at === null);
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  }
};

onMounted(loadUsers);

const { newUser, createUserHandler } = useCreateUser(loadUsers);
const { editedUser, startEditingUser, updateUserHandler } =
  useUpdateUser(loadUsers);
const { deleteUserHandler } = useDeleteUser(loadUsers);

const cancelEdit = () => {
  showEditModal.value = false;
};

const handleCreate = async () => {
  await createUserHandler();
  showAddModal.value = false;
};

const handleUpdate = async () => {
  await updateUserHandler();
  showEditModal.value = false;
};

const startEditingWithModal = (user: User) => {
  const userData: UserData = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    second_name: user.second_name || '',
    login: user.login,
    password: user.password,
  };
  startEditingUser(userData);
  showEditModal.value = true;
};

const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/users');
  return response.data;
};
</script>

<style scoped>
.table-container {
  margin-top: 1rem;
}

.q-dialog {
  min-width: 400px;
}
</style>
