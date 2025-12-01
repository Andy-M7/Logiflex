import { AttendanceRepositoryImpl } from '../../../data/repositories/AttendanceRepositoryImpl';
import { AttendanceRecord } from '../../entities/attendance';

const repo = new AttendanceRepositoryImpl();

export const GetDailyAttendanceUseCase = (date: string) => repo.getByDate(date);

export const SaveAttendanceUseCase = (record: AttendanceRecord) => repo.save(record);