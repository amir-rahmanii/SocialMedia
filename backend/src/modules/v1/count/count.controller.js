const fs = require("fs");

const User = require("../../../models/v1/user");
const Post = require("../../../models/v1/post");
const Message = require("../../../models/v1/message");
const Ticket = require("../../../models/v1/ticket");
const moment = require('moment');
const operatingSystems = ["Windows", "macOS", "Linux", "Android", "iOS"];


exports.countAllModel = async (req, res) => {
  try {
    // تاریخ امروز و دیروز را محاسبه می‌کنیم
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');
    const yesterdayStart = moment().subtract(1, 'days').startOf('day');
    const yesterdayEnd = moment().subtract(1, 'days').endOf('day');

    // تعداد کل موارد برای امروز
    const userCountToday = await User.countDocuments({ createdAt: { $gte: todayStart, $lt: todayEnd } });
    const ticketCountToday = await Ticket.countDocuments({ createdAt: { $gte: todayStart, $lt: todayEnd } });
    const messageCountToday = await Message.countDocuments({ createdAt: { $gte: todayStart, $lt: todayEnd } });
    const postCountToday = await Post.countDocuments({ createdAt: { $gte: todayStart, $lt: todayEnd } });

    // تعداد کل موارد برای دیروز
    const userCountYesterday = await User.countDocuments({ createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } });
    const ticketCountYesterday = await Ticket.countDocuments({ createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } });
    const messageCountYesterday = await Message.countDocuments({ createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } });
    const postCountYesterday = await Post.countDocuments({ createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } });

    // محاسبه درصد رشد برای هر کدام
    const calculateGrowth = (today, yesterday) => {
      if (yesterday === 0) return today > 0 ? 100 : 0; // اگر دیروز عددی نبود، رشد 100٪ برای امروز محاسبه می‌شود
      return ((today - yesterday) / yesterday) * 100;
    };

    const userGrowth = calculateGrowth(userCountToday, userCountYesterday);
    const ticketGrowth = calculateGrowth(ticketCountToday, ticketCountYesterday);
    const messageGrowth = calculateGrowth(messageCountToday, messageCountYesterday);
    const postGrowth = calculateGrowth(postCountToday, postCountYesterday);

    const totalUserCount = await User.countDocuments();
    const totalTicketCount = await Ticket.countDocuments();
    const totalMessageCount = await Message.countDocuments();
    const totalPostCount = await Post.countDocuments();

    // برگرداندن نتیجه به صورت JSON
    res.json({
      users: { count: totalUserCount, growth: userGrowth },
      tickets: { count: totalTicketCount, growth: ticketGrowth },
      messages: { count: totalMessageCount, growth: messageGrowth },
      posts: { count: totalPostCount, growth: postGrowth }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counts and growth percentages', error });
  }
};

exports.totalOsCount = async (req, res) => {
  try {
    const users = await User.find();

    const osCount = {};

    // مقداردهی اولیه به صفر برای تمام سیستم‌عامل‌ها
    operatingSystems.forEach(os => {
      osCount[os] = 0;
    });

    // محاسبه تعداد تکرار هر سیستم‌عامل
    users.forEach(user => {
      user.systemInfos.forEach(info => {
        if (osCount[info.os] !== undefined) {
          osCount[info.os] += 1; // افزایش تعداد لاگین
        }
      });
    });

    // تبدیل osCount به فرمت مناسب برای چارت
    const chartData = Object.entries(osCount).map(([os, count]) => ({
      name: os,
      value: count,
    }));

    res.status(200).json(chartData);
  } catch (err) {
    res.status(500).json({ message: "Error fetching OS login counts", error: err });
  }
};



exports.messgaeCountByMonth = async (req, res) => {
  try {
    // گرفتن تاریخ 12 ماه گذشته
    const startOfLastYear = new Date();
    startOfLastYear.setFullYear(startOfLastYear.getFullYear() - 1);
    startOfLastYear.setMonth(startOfLastYear.getMonth() + 1); // از ماه فعلی شروع کنید

    // استفاده از aggregation برای گروه‌بندی پیام‌ها بر اساس ماه
    const messageCounts = await Message.aggregate([
      {
        $match: { timestamp: { $gte: startOfLastYear } }, // فیلتر پیام‌های 12 ماه گذشته
      },
      {
        $group: {
          _id: { $month: "$timestamp" }, // گروه‌بندی بر اساس ماه
          count: { $sum: 1 }, // تعداد پیام‌ها در هر ماه
        },
      },
      {
        $sort: { _id: 1 }, // مرتب‌سازی بر اساس ماه
      },
    ]);

    // تبدیل ماه‌هایی که پیام ندارند به صفر
    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1; // ماه‌ها از 1 شروع می‌شوند
      const found = messageCounts.find(m => m._id === month);
      return { month, count: found ? found.count : 0 };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message counts' });
  }
}














