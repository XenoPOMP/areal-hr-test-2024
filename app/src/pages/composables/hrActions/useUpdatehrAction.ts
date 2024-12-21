import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { actionSchema } from 'src/pages/shemas/hrAction.shemas';
import { updateHrAction } from 'src/api/hrActions';

type SelectableValue = number | { label: string; value: number } | null;

export interface HrActions {
  id: string;
  action_type: string;
  date: string | null;
  salary: number;
  employee_id: SelectableValue;
  department_id: SelectableValue;
  position_id: SelectableValue;
}

export const useUpdatehrActions = () => {
  const $q = useQuasar();

  const editMode = ref(false);
  const editedAction = ref<HrActions | null>(null);

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

        $q.notify({
          type: 'positive',
          message: 'Операция успешно обновлена',
        });
        editedAction.value = null;
        editMode.value = false;
      } catch (error) {
        console.error('Ошибка обновления операции:', error);

        $q.notify({
          type: 'negative',
          message: 'Не удалось обновить операцию',
        });
      }
    }
  };

  return {
    editMode,
    editedAction,
    updateActionHandler,
  };
};
