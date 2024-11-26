<template>
  <div>
    <AppHeader />

    <h1>Кадровые операции</h1>

    <!-- Форма для добавления новой кадровой операции -->
    <form @submit.prevent="createActionHandler" class="form-container">
      <q-input
        v-model="newAction.action_type"
        label="Тип операции"
        filled
        required
      />
      <q-input
        v-model="newAction.date"
        label="Дата"
        type="date"
        filled
        required
      />
      <q-input
        v-model="newAction.salary"
        label="Зарплата"
        type="number"
        filled
        required
      />
      <q-select
        v-model="newAction.employee_id"
        :options="employees"
        option-label="label"
        option-value="value"
        label="Выберите сотрудника"
        filled
      />
      <q-select
        v-model="newAction.department_id"
        :options="departments"
        option-label="label"
        option-value="value"
        label="Выберите департамент"
        filled
      />
      <q-select
        v-model="newAction.position_id"
        :options="positions"
        option-label="label"
        option-value="value"
        label="Выберите должность"
        filled
      />
      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <!-- Таблица кадровых операций -->
    <q-table
      :rows="actions"
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
          @click="startEditingAction(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteActionHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <!-- Форма редактирования кадровой операции -->
    <div v-if="editMode && editedAction" class="edit-form">
      <h3>Изменить данные операции</h3>
      <form @submit.prevent="updateActionHandler">
        <q-input
          v-model="editedAction.action_type"
          label="Тип операции"
          filled
          required
        />
        <q-input
          v-model="editedAction.date"
          label="Дата"
          type="date"
          filled
          required
        />
        <q-input
          v-model="editedAction.salary"
          label="Зарплата"
          type="number"
          filled
          required
        />
        <q-btn type="submit" label="Изменить" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { getHrActions, createHrAction, updateHrAction } from 'src/api';
import { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import axios from 'axios';
const $q = useQuasar();

type SelectableValue = number | { label: string; value: number } | null;
interface HrActions {
  id: string;
  action_type: string;
  date: string | null;
  salary: number;
  employee_id: SelectableValue;
  department_id: SelectableValue;
  position_id: SelectableValue;
}

const actions = ref<HrActions[]>([]);
const newAction = ref<HrActions>({
  id: '',
  action_type: '',
  date: new Date().toLocaleDateString('en-CA'),
  salary: 0,
  employee_id: null,
  department_id: null,
  position_id: null,
});

const editMode = ref(false);
const editedAction = ref<HrActions | null>(null);

interface Employee {
  id: number;
  name: string;
  surname: string;
}

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

const employees = ref<Employee[]>([]);
const departments = ref<Department[]>([]);
const positions = ref<Position[]>([]);

const columns: QTableColumn[] = [
  {
    name: 'action_type',
    label: 'Тип операции',
    align: 'left',
    field: 'action_type',
    required: true,
  },
  { name: 'date', label: 'Дата', align: 'left', field: 'date', required: true },
  {
    name: 'salary',
    label: 'Зарплата',
    align: 'right',
    field: 'salary',
    required: true,
  },
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

const loadActions = async () => {
  try {
    actions.value = await getHrActions();
  } catch (error) {
    console.error('Ошибка загрузки операций:', error);
  }
};

const loadSelectData = async () => {
  try {
    const employeesResponse = await axios.get(
      'http://localhost:3000/employees'
    );
    const departmentsResponse = await axios.get(
      'http://localhost:3000/departments'
    );
    const positionsResponse = await axios.get(
      'http://localhost:3000/positions'
    );

    employees.value = employeesResponse.data.map((emp: Employee) => ({
      label: `${emp.name} ${emp.surname}`,
      value: emp.id,
    }));
    departments.value = departmentsResponse.data.map((dep: Department) => ({
      label: dep.name,
      value: dep.id,
    }));
    positions.value = positionsResponse.data.map((pos: Position) => ({
      label: pos.name,
      value: pos.id,
    }));
  } catch (error) {
    console.error('Ошибка загрузки данных для выпадающих списков:', error);
  }
};

onMounted(() => {
  loadActions();
  loadSelectData();
});

const createActionHandler = async () => {
  if (
    newAction.value.employee_id == null ||
    newAction.value.department_id == null ||
    newAction.value.position_id == null
  ) {
    console.error(
      'Все поля выбора (сотрудник, департамент, должность) должны быть заполнены.'
    );
    return;
  }

  try {
    const actionData = {
      action_type: newAction.value.action_type.slice(0, 50),
      date: newAction.value.date || new Date().toISOString().split('T')[0],
      salary: newAction.value.salary,
      employee_id:
        typeof newAction.value.employee_id === 'object'
          ? newAction.value.employee_id.value
          : newAction.value.employee_id,
      department_id:
        typeof newAction.value.department_id === 'object'
          ? newAction.value.department_id.value
          : newAction.value.department_id,
      position_id:
        typeof newAction.value.position_id === 'object'
          ? newAction.value.position_id.value
          : newAction.value.position_id,
    };

    await createHrAction(actionData);

    // Очистить значения после добавления
    newAction.value = {
      id: '',
      action_type: '',
      date: new Date().toISOString().split('T')[0],
      salary: 0,
      employee_id: null,
      department_id: null,
      position_id: null,
    };
    await loadActions();
  } catch (error) {
    console.error('Ошибка добавления операции:', error);
    throw error;
  }
};

const updateActionHandler = async () => {
  if (editedAction.value) {
    if (
      editedAction.value.employee_id == null ||
      editedAction.value.department_id == null ||
      editedAction.value.position_id == null
    ) {
      console.error(
        'Все поля выбора (сотрудник, департамент, должность) должны быть заполнены.'
      );
      return;
    }

    try {
      await updateHrAction(editedAction.value.id, {
        action_type: editedAction.value.action_type,
        date: new Date().toISOString().split('T')[0],
        salary: editedAction.value.salary,
        employee_id:
          typeof editedAction.value.employee_id === 'object'
            ? editedAction.value.employee_id.value
            : editedAction.value.employee_id,
        department_id:
          typeof editedAction.value.department_id === 'object'
            ? editedAction.value.department_id.value
            : editedAction.value.department_id,
        position_id:
          typeof editedAction.value.position_id === 'object'
            ? editedAction.value.position_id.value
            : editedAction.value.position_id,
      });
      await loadActions();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления операции:', error);
      throw error;
    }
  }
};

const startEditingAction = (action: HrActions) => {
  editedAction.value = { ...action };
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  editedAction.value = null;
};

const deleteActionHandler = async (hrId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/hr_actions/${hrId}/soft-delete`
    );
    console.log('Response:', response.data);
    await loadActions();
    $q.notify({ type: 'positive', message: 'Действие успешно удалено' }); // Успешное уведомление
  } catch (error) {
    console.error('Ошибка удаления действия:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении действия' }); // Ошибка
  }
};
</script>

<style scoped>
.form-container,
.edit-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.table-container {
  margin-top: 1rem;
}
</style>
