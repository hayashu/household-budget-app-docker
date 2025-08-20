# 家庭记账应用 - 需求定义书

## 1. 项目概述

使用 React/Express/PostgreSQL 技术栈开发的家庭记账管理应用程序

## 2. 功能需求

### 2.1 收支管理功能
- **收入记录**
  - 金额、日期、备注的输入
  - 记录的编辑、删除
  
- **支出记录**
  - 金额、日期、类别、备注的输入
  - 记录的编辑、删除

### 2.2 类别管理功能
- 支出类别的管理
  - 类别的添加、编辑、删除
  - 基本类别：餐饮、交通、水电、娱乐、日用品、医疗、其他

### 2.3 显示功能
- 月度收支清单显示
- 日度收支清单显示
- 当前余额显示
- 分类别支出汇总显示

## 3. 用户故事

### 收支记录类
- 作为用户，我想记录收入（金额、日期、备注）
- 作为用户，我想修改或删除已记录的收入
- 作为用户，我想记录支出（金额、日期、类别、备注）
- 作为用户，我想修改或删除已记录的支出

### 类别管理类
- 作为用户，我想添加支出类别
- 作为用户，我想编辑现有类别
- 作为用户，我想删除不需要的类别

### 显示确认类
- 作为用户，我想查看本月的收支清单
- 作为用户，我想查看指定月份的收支
- 作为用户，我想确认当前余额
- 作为用户，我想查看分类别的支出汇总

## 4. 数据模型

### 4.1 表结构

```sql
-- 类别表
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 交易记录表
CREATE TABLE transactions (
    id          SERIAL PRIMARY KEY,
    type        VARCHAR(10) NOT NULL,  -- 'income' or 'expense'
    amount      DECIMAL(10,2) NOT NULL,
    date        DATE NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    memo        TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 数据库设计图

```
┌─────────────────┐         ┌─────────────────────────┐
│   categories    │         │     transactions        │
├─────────────────┤         ├─────────────────────────┤
│ id (PK)         │◄────────┤ id (PK)                 │
│ name            │         │ type                    │
│ created_at      │         │ amount                  │
└─────────────────┘         │ date                    │
                             │ category_id (FK)        │
                             │ memo                    │
                             │ created_at              │
                             │ updated_at              │
                             └─────────────────────────┘
```

## 5. 技术栈

### 5.1 前端
- **React 18** - 主要框架
- **TypeScript** - 类型安全
- **CSS Modules** - 样式处理
- **React Router** - 页面路由
- **Axios** - API通信

### 5.2 后端
- **Express.js** - Web服务器
- **TypeScript** - 类型安全
- **pg** - PostgreSQL客户端
- **cors** - CORS设置
- **dotenv** - 环境变量管理

### 5.3 数据库
- **PostgreSQL** - 主数据库

### 5.4 开发环境
- **Node.js** - 运行时环境
- **npm** - 包管理器
- **nodemon** - 开发时自动重启
- **concurrently** - 前后端同时启动

## 6. 项目结构

```
household-budget-app/
├── client/                    # React 前端
│   ├── public/
│   ├── src/
│   │   ├── components/        # 通用组件
│   │   ├── pages/            # 页面组件
│   │   ├── hooks/            # 自定义Hook
│   │   ├── services/         # API通信
│   │   ├── types/            # TypeScript类型定义
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── server/                   # Express 后端
│   ├── src/
│   │   ├── controllers/      # 控制器
│   │   ├── models/           # 数据模型
│   │   ├── routes/           # 路由
│   │   ├── database/         # 数据库连接、迁移
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── database/                 # SQL相关
│   ├── migrations/           # 迁移文件
│   └── seeds/               # 初始数据
├── package.json             # 根级别（开发用）
└── README.md
```

## 7. 非功能需求

### 7.1 数据管理
- 数据持久化（PostgreSQL）
- 数据一致性保证

### 7.2 可用性
- 直观的操作界面
- 响应式设计

## 8. 开发阶段

### 阶段1：环境搭建
- Node.js、PostgreSQL环境构建
- 项目初始化

### 阶段2：数据库构建
- 表创建
- 初始数据导入

### 阶段3：后端实现
- API创建
- CRUD操作实现

### 阶段4：前端实现
- React页面创建
- API集成

### 阶段5：功能确认・测试
- 集成测试
- UI/UX调整

---

**创建日期**：2025年7月5日  
**创建者**：学习者项目