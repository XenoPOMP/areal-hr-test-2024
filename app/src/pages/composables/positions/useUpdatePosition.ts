import { ref } from 'vue';
import { updatePosition } from 'src/api/positions';
import { positionSchema } from 'src/pages/shemas/Position.shemas';
import { useQuasar } from 'quasar';

export function useUpdatePosition(loadPositions: () => Promise<void>) {
  const $q = useQuasar();
  const editedPosition = ref<{ id: string; name: string } | null>(null);
  const editMode = ref(false);

  const startEditingPosition = (position: { id: string; name: string }) => {
    editedPosition.value = { ...position };
    editMode.value = true;
  };

  const cancelEdit = () => {
    editedPosition.value = null;
    editMode.value = false;
  };

  const updatePositionHandler = async () => {
    if (!editedPosition.value) return;

    const positionData = { name: editedPosition.value.name };

    const { error } = positionSchema.validate(positionData, {
      abortEarly: false,
    });

    if (error) {
      error.details.forEach((err) =>
        $q.notify({ type: 'negative', message: err.message })
      );
      return;
    }

    try {
      await updatePosition(editedPosition.value.id, positionData);
      await loadPositions();
      cancelEdit();
      $q.notify({ type: 'positive', message: 'Должность успешно обновлена' });
    } catch (err) {
      console.error('Ошибка обновления должности:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при обновлении должности',
      });
    }
  };

  return {
    editMode,
    editedPosition,
    startEditingPosition,
    cancelEdit,
    updatePositionHandler,
  };
}
