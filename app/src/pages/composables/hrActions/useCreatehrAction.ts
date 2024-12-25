import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { actionSchema } from 'src/pages/shemas/hrAction.shemas';
import { createHrAction } from 'src/api/hrActions';
import axios from 'axios'; // Для отправки запросов

type SelectableValue = { label: string; value: number };

export const useCreatehrActions = () => {
  const $q = useQuasar();

  interface HrAction {
    id: number;
    action_type: string;
    date: string;
    salary: number;
    employee_id: number;
    department_id: number;
    position_id: number;
    deleted_at: Date | null;
  }

  const newAction = ref({
    action_type: '',
    date: new Date().toLocaleDateString('en-CA'),
    salary: 0,
    employee_id: null as SelectableValue | null,
    department_id: null as SelectableValue | null,
    position_id: null as SelectableValue | null,
  });

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
      const response = await axios.get<HrAction[]>(
        `http://localhost:3000/hr_actions?employee_id=${employeeId}`
      );

      const existingActions = response.data.filter(
        (action) =>
          action.employee_id === employeeId && (!action.deleted_at || false)
      );

      if (existingActions.length > 0) {
        $q.notify({
          type: 'negative',
          message: 'Запись для этого сотрудника уже существует.',
        });
        return;
      }

      const actionData = {
        action_type: newAction.value.action_type.slice(0, 50),
        date: newAction.value.date || new Date().toISOString().split('T')[0],
        salary: newAction.value.salary,
        employee_id: employeeId,
        department_id: departmentId,
        position_id: positionId,
      };

      await createHrAction(actionData);

      $q.notify({
        type: 'positive',
        message: 'Действие успешно добавлено!',
      });

      newAction.value = {
        action_type: '',
        date: new Date().toISOString().split('T')[0],
        salary: 0,
        employee_id: null,
        department_id: null,
        position_id: null,
      };
    } catch (error) {
      console.error('Ошибка добавления операции:', error);

      $q.notify({
        type: 'negative',
        message:
          'Не удалось добавить действие. Проверьте данные и повторите попытку.',
      });
    }
  };

  return {
    newAction,
    createActionHandler,
  };
};
