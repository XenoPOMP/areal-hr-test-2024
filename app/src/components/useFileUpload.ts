import { ref } from 'vue';
import axios from 'axios';
//todo to utils remove
export function useFileUpload() {
  const selectedEmployeeId = ref<number | null>(null);
  const isModalOpen = ref(false);
  const selectedFile = ref<File | null>(null);

  const openModal = (employee_id: number) => {
    selectedEmployeeId.value = employee_id;
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
    selectedEmployeeId.value = null;
    selectedFile.value = null;
  };

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      selectedFile.value = files[0];
    }
  };

  const uploadImage = async () => {
    if (!selectedFile.value || !(selectedFile.value instanceof File)) {
      alert('Пожалуйста, выберите файл.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile.value);
    formData.append('employee_id', selectedEmployeeId.value!.toString());

    try {
      await axios.post('http://localhost:3000/uploads/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Файл успешно загружен!');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить файл.');
    } finally {
      closeModal();
    }
  };

  return {
    selectedEmployeeId,
    isModalOpen,
    selectedFile,
    openModal,
    closeModal,
    handleFileUpload,
    uploadImage,
  };
}
