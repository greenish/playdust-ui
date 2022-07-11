import round from './round';

const humanizeSolana = (input?: number): string => `◎${round(input, 2) ?? 0}`;

export default humanizeSolana;
