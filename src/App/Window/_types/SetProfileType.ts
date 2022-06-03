import { SetterOrUpdater } from 'recoil';
import PlaydustProfileType from './PlaydustProfileType';

type SetProfileType = SetterOrUpdater<PlaydustProfileType | null>;

export default SetProfileType;
