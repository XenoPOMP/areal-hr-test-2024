import { ref } from 'vue';
import { createPosition } from 'src/api/positions';
import { positionSchema } from 'src/pages/shemas/Position.shemas';
import { useQuasar } from 'quasar';

export function useCreatePosition(loadPositions: () => Promise<void>) {
  const $q = useQuasar();
  const newPosition = ref({ id: '', name: '' });

  const createPositionHandler = async () => {
    const positionData = {
      name: newPosition.value.name.slice(0, 255),
    };

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
      await createPosition(positionData);
      newPosition.value = { id: '', name: '' };
      await loadPositions();
      $q.notify({ type: 'positive', message: 'Должность успешно добавлена' });
    } catch (err) {
      console.error('Ошибка добавления должности:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при добавлении должности',
      });
    }
  };

  return { newPosition, createPositionHandler };
}
