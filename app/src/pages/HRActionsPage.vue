<template>
  <div>
    <AppHeader />
    <h1>Кадровые операции</h1>

    <!-- Модальное окно для добавления новой кадровой операции -->
    <q-btn label="Добавить операцию" color="primary" @click="openCreateModal" />
    <q-dialog v-model="createModalVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавить новую кадровую операцию</div>
        </q-card-section>

        <q-card-section>
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
            class="custom-select"
          />
          <q-select
            v-model="newAction.department_id"
            :options="departments"
            option-label="label"
            option-value="value"
            label="Выберите отдел"
            filled
            class="custom-select"
          />
          <q-select
            v-model="newAction.position_id"
            :options="positions"
            option-label="label"
            option-value="value"
            label="Выберите должность"
            filled
            class="custom-select"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            label="Добавить"
            color="primary"
            @click="createActionHandler"
          />
          <q-btn
            label="Отмена"
            color="secondary"
            flat
            @click="closeCreateModal"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для редактирования кадровой операции -->
    <q-dialog v-model="editMode">
      <q-card v-if="editedAction">
        <q-card-section>
          <div class="text-h6">Изменить данные операции</div>
        </q-card-section>

        <q-card-section>
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
          <q-select
            v-model="editedAction.department_id"
            :options="departments"
            option-label="label"
            option-value="value"
            label="Выберите отдел"
            filled
            class="custom-select"
            required
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            label="Изменить"
            color="primary"
            @click="updateActionHandler"
          />
          <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { useCreatehrActions } from 'src/pages/composables/hrActions/useCreatehrAction';
import { useUpdatehrActions } from 'src/pages/composables/hrActions/useUpdatehrAction';
import { useDeletehrActions } from 'src/pages/composables/hrActions/useDeletehrAction';
import { HRActionsColumns } from 'src/pages/columns/hrActionsColumns';
import axios from 'axios';

const createModalVisible = ref(false);
const { newAction, createActionHandler } = useCreatehrActions();
const { editMode, editedAction, updateActionHandler } = useUpdatehrActions();
const { deleteActionHandler } = useDeletehrActions();

const actions = ref<Action[]>([]);
const employees = ref([]);
const departments = ref([]);
const positions = ref([]);
const columns = ref(HRActionsColumns);

const openCreateModal = () => {
  createModalVisible.value = true;
};

const closeCreateModal = () => {
  createModalVisible.value = false;
};

const loadActions = async () => {
  try {
    const [
      actionsResponse,
      employeesResponse,
      departmentsResponse,
      positionsResponse,
    ] = await Promise.all([
      axios.get<Action[]>('http://localhost:3000/hr_actions'),
      axios.get<Employee[]>('http://localhost:3000/employees?deleted_at=null'),
      axios.get<Department[]>(
        'http://localhost:3000/departments?deleted_at=null'
      ),
      axios.get<Position[]>('http://localhost:3000/positions?deleted_at=null'),
    ]);

    const employeesMap = Object.fromEntries(
      employeesResponse.data.map((emp: Employee) => [
        emp.id,
        `${emp.surname} ${emp.name} ${emp.second_name || ''}`.trim(),
      ])
    );
    const departmentsMap = Object.fromEntries(
      departmentsResponse.data.map((dep: Department) => [dep.id, dep.name])
    );
    const positionsMap = Object.fromEntries(
      positionsResponse.data.map((pos: Position) => [pos.id, pos.name])
    );

    actions.value = actionsResponse.data.map((action: Action) => ({
      ...action,
      employee_name: employeesMap[action.employee_id],
      department_name: departmentsMap[action.department_id],
      position_name: positionsMap[action.position_id],
    }));
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
};

interface Employee {
  id: number;
  name: string;
  surname: string;
  second_name: string;
}

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

interface Action {
  id: number;
  action_type: string;
  date: string;
  employee_id: number;
  department_id: number;
  position_id: number;
  salary: number;
  employee_name?: string;
  department_name?: string;
  position_name?: string;
}

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

import { HrActions } from 'src/pages/composables/hrActions/useUpdatehrAction';

const startEditingAction = (action: HrActions) => {
  editedAction.value = { ...action };
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false; // Выключаем режим редактирования
  editedAction.value = null; // Очищаем данные редактируемой операции
};

onMounted(() => {
  loadActions();
  loadSelectData();
});
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
.custom-select {
  width: 230px !important;
}
</style>
