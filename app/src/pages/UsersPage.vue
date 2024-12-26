<template>
  <div>
    <AppHeader />

    <h1>Управление пользователями</h1>
    <q-btn
      label="Добавить пользователя"
      color="primary"
      @click="showAddModal = true"
    />
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
          <q-btn flat label="Отмена" color="negative" @click="cancelAddModal" />
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
            type="password"
            filled
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
import AppHeader from 'src/components/AppHeader.vue';
import { useCreateUser } from 'src/pages/composables/users/useCreateUser';
import { useUpdateUser } from 'src/pages/composables/users/useUpdateUser';
import { useDeleteUser } from 'src/pages/composables/users/useDeleteUser';
import { usersColumns } from 'src/pages/columns/usersColumns';
import { User } from 'src/pages/types/User';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { userSchema } from 'src/pages/shemas/User.shemas';

const users = ref<User[]>([]);
const columns = usersColumns;

const newUser = ref({
  id: 0,
  name: '',
  surname: '',
  second_name: '',
  login: '',
  password: '',
  role: 'hr',
});

const editedUser = ref<User | null>(null);

const showAddModal = ref(false);
const showEditModal = ref(false);
const $q = useQuasar();

const loadUsers = async () => {
  try {
    const response = await axios.get<User[]>('http://localhost:3000/users');
    users.value = response.data.map((user) => ({
      ...user,
      id: Number(user.id),
    }));
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при загрузке пользователей',
    });
  }
};

onMounted(loadUsers);

const { createUserHandler } = useCreateUser(loadUsers);
const { startEditingUser, updateUserHandler } = useUpdateUser(loadUsers);
const { deleteUserHandler } = useDeleteUser(loadUsers);

const handleCreate = async () => {
  newUser.value.role = 'hr';
  const { error } = userSchema.validate(newUser.value);
  if (error) {
    error.details.forEach((err) =>
      $q.notify({ type: 'negative', message: err.message })
    );
    return;
  }
  await createUserHandler();
  showAddModal.value = false;
};

const handleUpdate = async () => {
  if (editedUser.value) {
    editedUser.value.role = 'hr';
  }
  const { error } = userSchema.validate(editedUser.value);
  if (error) {
    error.details.forEach((err) =>
      $q.notify({ type: 'negative', message: err.message })
    );
    return;
  }
  await updateUserHandler();
  showEditModal.value = false;
};

const startEditingWithModal = (user: User) => {
  startEditingUser(user);
  showEditModal.value = true;
};

const cancelAddModal = () => {
  showAddModal.value = false;
  resetNewUser();
};

const cancelEdit = () => {
  showEditModal.value = false;
  if (editedUser.value) resetEditedUser();
};

const resetNewUser = () => {
  newUser.value = {
    id: 0,
    name: '',
    surname: '',
    second_name: '',
    login: '',
    password: '',
    role: 'hr',
  };
};

const resetEditedUser = () => {
  if (editedUser.value) {
    editedUser.value = { ...editedUser.value };
  }
};
</script>

<style scoped>
.table-container {
  margin-top: 1rem;
}
</style>
