import { Router } from 'express';
import { Employee } from 'models/employee.model';

const router = Router();

router.post('/create', async (req, res) => {
  const { employeeData, passportData, addressData } = req.body;

  try {
    const newEmployee = await Employee.createWithAssociations(
      employeeData,
      passportData,
      addressData,
    );
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Ошибка при создании сотрудника с ассоциациями:', error);
    res.status(500).json({ message: 'Не удалось создать сотрудника', error });
  }
});

export default router;
