import { PrismaClient } from '@prisma/client';

import { fromUTC, toUTC } from '../utils/date.util';

interface DailySalesReport {
  date: Date;
  total_sales: number;
  order_count: number;
}

interface MonthlySalesReport {
  month: Date;
  total_sales: number;
  order_count: number;
}

export class ReportService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Tạo báo cáo doanh số theo ngày
   */
  async getDailySalesReport(
    startDate: Date,
    endDate: Date,
    timezone = 'UTC'
  ): Promise<DailySalesReport[]> {
    try {
      // Đảm bảo dates là UTC
      const utcStartDate = toUTC(startDate);
      const utcEndDate = toUTC(endDate);

      // Truy vấn dữ liệu từ database (đã lưu trong UTC)
      const salesData = await this.prisma.$queryRaw<DailySalesReport[]>`
        SELECT 
          DATE_TRUNC('day', created_at)::timestamp as date,
          COALESCE(SUM(amount), 0) as total_sales,
          COUNT(*) as order_count
        FROM orders
        WHERE created_at BETWEEN ${utcStartDate} AND ${utcEndDate}
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date
      `;

      // Chuyển đổi dates về timezone của client
      return salesData.map(item => ({
        ...item,
        date: fromUTC(item.date, timezone),
      }));
    } catch (error) {
      console.error('Error in getDailySalesReport:', error);
      throw new Error('Failed to get daily sales report');
    }
  }

  /**
   * Tạo báo cáo doanh số theo tháng
   */
  async getMonthlySalesReport(year: number, timezone = 'UTC'): Promise<MonthlySalesReport[]> {
    try {
      // Tạo date range cho năm
      const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

      // Truy vấn dữ liệu từ database (đã lưu trong UTC)
      const salesData = await this.prisma.$queryRaw<MonthlySalesReport[]>`
        SELECT 
          DATE_TRUNC('month', created_at)::timestamp as month,
          COALESCE(SUM(amount), 0) as total_sales,
          COUNT(*) as order_count
        FROM orders
        WHERE created_at BETWEEN ${startDate} AND ${endDate}
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month
      `;

      // Chuyển đổi dates về timezone của client
      return salesData.map(item => ({
        ...item,
        month: fromUTC(item.month, timezone),
      }));
    } catch (error) {
      console.error('Error in getMonthlySalesReport:', error);
      throw new Error('Failed to get monthly sales report');
    }
  }
}
