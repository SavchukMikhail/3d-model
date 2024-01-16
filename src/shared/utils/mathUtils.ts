export class MathUtils {
  /**
   * Функция для вычисления среднего значения
   */
  public static calculateMean(data: number[]): number {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
  }

  /**
   * Функция для вычисления стандартного отклонения
   */
  public static calculateStandardDeviation(data: number[]): number {
    const mean = MathUtils.calculateMean(data);
    const squaredDifferences = data.map((value) => Math.pow(value - mean, 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, value) => acc + value, 0);
    const variance = sumSquaredDifferences / data.length;
    return Math.sqrt(variance);
  }

  public static calculateOutOfControl(data: number[], ucl: number, lcl: number): number[] {
    let oocCount = 0;
    const res: number[] = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i] >= ucl || data[i] <= lcl) oocCount++;

      res.push(oocCount / (i + 1));
    }

    return res;
  }

  /**
   * Функция для вычисления минимального значения
   */
  public static calculateMin(data: number[]): number {
    return Math.min(...data);
  }

  /**
   * Функция для вычисления максимального значения
   */
  public static calculateMax(data: number[]): number {
    return Math.max(...data);
  }
}
