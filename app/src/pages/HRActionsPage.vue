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
import { useQuasar } from 'quasar';
import { HRactionsColumns } from 'pages/columns';
import Joi from 'joi';
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

const columns = ref(HRactionsColumns);

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

const actionSchema = Joi.object({
  id: Joi.number().optional().allow(null),
  action_type: Joi.string().max(50).required().messages({
    'string.empty': 'Тип операции обязателен',
    'string.max': 'Тип операции не должен превышать 50 символов',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Дата операции обязательна',
  }),
  salary: Joi.number().positive().required().messages({
    'number.base': 'Зарплата должна быть положительным числом',
    'number.empty': 'Зарплата обязательна',
  }),
  employee_id: Joi.number().integer().required().messages({
    'number.base': 'Необходимо выбрать сотрудника',
  }),
  department_id: Joi.number().integer().required().messages({
    'number.base': 'Необходимо выбрать отдел',
  }),
  position_id: Joi.number().integer().required().messages({
    'number.base': 'Необходимо выбрать должность',
  }),
}).unknown(false);

const createActionHandler = async () => {
  const employeeId =
    typeof newAction.value.employee_id === 'object'
      ? newAction.value.employee_id!.value
      : newAction.value.employee_id!;

  const departmentId =
    typeof newAction.value.department_id === 'object'
      ? newAction.value.department_id!.value
      : newAction.value.department_id!;

  const positionId =
    typeof newAction.value.position_id === 'object'
      ? newAction.value.position_id!.value
      : newAction.value.position_id!;

  const { error } = actionSchema.validate({
    action_type: newAction.value.action_type,
    date: newAction.value.date,
    salary: newAction.value.salary,
    employee_id: employeeId,
    department_id: departmentId,
    position_id: positionId,
  });

  if (error) {
    $q.notify({
      type: 'negative',
      message: error.details[0].message,
    });
    return;
  }

  try {
    const actionData = {
      action_type: newAction.value.action_type.slice(0, 50),
      date: newAction.value.date || new Date().toISOString().split('T')[0],
      salary: newAction.value.salary,
      employee_id: employeeId,
      department_id: departmentId,
      position_id: positionId,
    };

    await createHrAction(actionData);

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
    const employeeId =
      typeof editedAction.value.employee_id === 'object'
        ? editedAction.value.employee_id!.value
        : editedAction.value.employee_id!;

    const departmentId =
      typeof editedAction.value.department_id === 'object'
        ? editedAction.value.department_id!.value
        : editedAction.value.department_id!;

    const positionId =
      typeof editedAction.value.position_id === 'object'
        ? editedAction.value.position_id!.value
        : editedAction.value.position_id!;

    const { error } = actionSchema.validate({
      action_type: editedAction.value.action_type,
      date: editedAction.value.date,
      salary: editedAction.value.salary,
      employee_id: employeeId,
      department_id: departmentId,
      position_id: positionId,
    });

    if (error) {
      $q.notify({
        type: 'negative',
        message: error.details[0].message,
      });
      return;
    }

    try {
      await updateHrAction(editedAction.value.id, {
        action_type: editedAction.value.action_type,
        date: new Date().toISOString().split('T')[0],
        salary: editedAction.value.salary,
        employee_id: employeeId,
        department_id: departmentId,
        position_id: positionId,
      });
      await loadActions();
      cancelEdit();

      $q.notify({
        type: 'positive',
        message: 'Операция успешно обновлена',
      });
    } catch (error) {
      console.error('Ошибка обновления операции:', error);

      $q.notify({
        type: 'negative',
        message: 'Не удалось обновить операцию',
      });
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
    $q.notify({ type: 'positive', message: 'Действие успешно удалено' });
  } catch (error) {
    console.error('Ошибка удаления действия:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении действия' });
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
