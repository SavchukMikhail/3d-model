export interface IJointInfoDto {
  data: (string | number)[];
  /**
   * Среднее значение
   */
  mean: number;
  /**
   * Стандартное отклонение
   */
  std: number;
  /**
   * Upper control limit
   */
  ucl: number;
  /**
   * Lower control limit
   */
  lcl: number;
  /**
   * Upper specification limit
   */
  usl: number;
  /**
   * Lower specification limit
   */
  lsl: number;
  min: number;
  max: number;
  /**
   * Out of control
   */
  ooc: number[];
}
