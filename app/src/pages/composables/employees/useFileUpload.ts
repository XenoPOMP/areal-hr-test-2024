import { ref } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useFileUpload(getEmployees?: () => Promise<void>) {
  const isFileUploadModalOpen = ref(false);
  const uploadedFiles = ref<File[]>([]);
  const selectedEmployeeId = ref<number | null>(null);
  const $q = useQuasar();

  const openFileUploadModal = (employeeId: number) => {
    selectedEmployeeId.value = employeeId;
    isFileUploadModalOpen.value = true;
  };

  const closeFileUploadModal = () => {
    isFileUploadModalOpen.value = false;
    uploadedFiles.value = [];
    selectedEmployeeId.value = null;
  };

  const uploadFileHandler = async () => {
    console.log('uploadedFiles:', uploadedFiles.value);

    if (!uploadedFiles.value.length) {
      $q.notify({
        type: 'warning',
        message: 'Пожалуйста, выберите файл для загрузки.',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadedFiles.value[0]); // Загружаем первый файл

      // Делаем POST-запрос на сервер
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        'http://localhost:3000/files/upload', // Путь к серверу
        formData, // Отправка данных формы
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Устанавливаем правильный Content-Type
          },
        }
      );

      $q.notify({
        type: 'positive',
        message: 'Файл успешно загружен!',
      });

      closeFileUploadModal(); // Закрыть модальное окно
      uploadedFiles.value = []; // Очистить загруженные файлы
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      $q.notify({
        type: 'negative',
        message: 'Не удалось загрузить файл. Попробуйте снова.',
      });
    }
  };

  return {
    isFileUploadModalOpen,
    uploadedFiles,
    openFileUploadModal,
    closeFileUploadModal,
    uploadFileHandler,
  };
}
