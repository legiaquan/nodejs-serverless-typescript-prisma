import { fromUTC, toUTC } from "../utils/date.utils"

export class ReportService {
  /**
   * Tạo báo cáo doanh số theo ngày
   */
  async getDailySalesReport(startDate: Date, endDate: Date, timezone = "UTC"): Promise<any[]> {
    // Đảm bảo dates là UTC
    const utcStartDate = toUTC(startDate)
    const utcEndDate = toUTC(endDate)

    // Truy vấn dữ liệu từ database (đã lưu trong UTC)
    const salesData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        SUM(amount) as total_sales,
        COUNT(*) as order_count
      FROM orders
      WHERE created_at BETWEEN ${utcStartDate} AND ${utcEndDate}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `

    // Chuyển đổi dates về timezone của client
    return salesData.map((item: any) => ({
      ...item,
      date: fromUTC(item.date, timezone),
    }))
  }

  /**
   * Tạo báo cáo doanh số theo tháng
   */
  async getMonthlySalesReport(year: number, timezone = "UTC"): Promise<any[]> {
    // Tạo date range cho năm
    const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))

    // Truy vấn dữ liệu từ database (đã lưu trong UTC)
    const salesData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount) as total_sales,
        COUNT(*) as order_count
      FROM orders
      WHERE created_at BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `

    // Chuyển đổi dates về timezone của client
    return salesData.map((item: any) => ({
      ...item,
      month: fromUTC(item.month, timezone),
    }))
  }
}

