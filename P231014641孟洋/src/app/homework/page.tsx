"use client";

import { useState } from "react";

export default function HomeworkPage() {
  const [activeAssignment, setActiveAssignment] = useState<
    "first" | "third" | null
  >(null);
  const [viewMode, setViewMode] = useState<"rendered" | "source">("rendered");

  const firstAssignmentContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web前端设计</title>
</head>
<body>
    <h1>这是我的第一个页面中的一级标题</h1>
     <li><a href="#home">首页</a></li>
     <li><a href="#about">关于我们</a></li>
     <li><a href="#services">服务</a></li>
     <li><a href="#contact">联系我们</a></li>
     </ul>
            </nav>
        </header>
        
        <div class="container">
            <section id="home">
                <h2>9/h2>
                <p>建议</p>
            </section>
            
            <section id="about">
                <h2>关于我们</h2>
                <p>较为简单的展示html内容。</p>
            </section>
            
            <section id="services">
                <h2>二级标题</h2>
                <ul>
                    <li>HTML/CSS/JavaScript开发</li>
                    <li>区块元素</li>
                    <li>内容组织元素</li>
                    <li>文本语义元素</li>
                    <li>编辑相关元素</li>
                    <li>嵌入内容元素</li>
                    <li>表格元素</li>
                    <li>表单元素</li>

                </ul>
            </section>
            
            <section id="contact">
                <h2>如有疑问，请联系我们</h2>
                <form>
                    <label for="name">姓名:</label>
                    <input type="text" id="name" name="name" required><br><br>
                    <label for="email">电子邮件:</label>
                    <input type="email" id="email" name="email" required><br><br>
                    <label for="message">留言:</label><br>
                    <textarea id="message" name="message" rows="4" cols="50" required></textarea><br><br>
                    <input type="submit" value="提交">
                </form>
          
                
</body>
</html>`;

  const thirdAssignmentContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript 核心语法学习（一）</title>
    <script>
        let a =100
        //alert(a)
        console.log(a)
        const api_key='ssssx-=-dddd'
        console.log(api_key)
        console.log(typeof a,typeof api_key,typeof true)
        let b = '1'
        console.log(a+b)
        console.log(a+Number(b))
        let c ='100'
        console.log(a==c)
        console.log(a===c)
        //分支语句
        let current_time='12:20'
        if(current_time='12:20'){
            console.log('时间到了')
        }else{
            console.log('该吃饭了')
        }
        //for循环
        for(let i=0;i<10;i++){
            console.log(i)
        }
        //while循环
        let hug=60
        while(hug>0){
            console.log('继续干饭')
            hug=hug-10
        }
        //函数
        function intro(){
            console.log('你好，我是一个脚本')
        }
        intro()
        function intro2(content){
            console.log('以下是我介绍的内容：'+Spring(content))
        }
        intro2('我这是传入的参数')
        function intro3(content1,content2){
            console.log('以下是我介绍的内容：'+Spring(content1)+Spring(content2))
        }
        intro3('我这是传入的参数1','我这是传入的参数2',444)
        function intro4(content){
            console.log(content)
            return content+'我是返回值'
        }
        intro4('带返回值的函数')
        let intro5=intro4('带返回值的函数')
        console.log(result)
      </script>
    </head>
    <body>
    </body>
</html>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ml-72">
      <div className="p-8">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-purple-100 mb-8 text-center">
            过往作业
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div
              className={`bg-white bg-opacity-15 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-opacity-20 hover:scale-105 ${
                activeAssignment === "first"
                  ? "ring-2 ring-white ring-opacity-50"
                  : ""
              }`}
              onClick={() =>
                setActiveAssignment(
                  activeAssignment === "first" ? null : "first"
                )
              }
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 bg-opacity-30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-100">
                    第一次作业
                  </h3>
                  <p className="text-purple-100 text-sm">Web前端设计基础</p>
                </div>
              </div>
              <p className="text-gray-100 text-sm">
                HTML基础结构学习，包含导航、表单、列表等基本元素的使用。
              </p>
            </div>

            <div
              className={`bg-white bg-opacity-15 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-opacity-20 hover:scale-105 ${
                activeAssignment === "third"
                  ? "ring-2 ring-white ring-opacity-50"
                  : ""
              }`}
              onClick={() =>
                setActiveAssignment(
                  activeAssignment === "third" ? null : "third"
                )
              }
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-yellow-500 bg-opacity-30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-100">
                    第三次作业
                  </h3>
                  <p className="text-purple-100 text-sm">
                    JavaScript核心语法学习
                  </p>
                </div>
              </div>
              <p className="text-gray-100 text-sm">
                JavaScript基础语法练习，包含变量、函数、循环、条件语句等核心概念。
              </p>
            </div>
          </div>

          {activeAssignment && (
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-100">
                  {activeAssignment === "first"
                    ? "第一次作业 - Web前端设计"
                    : "第三次作业 - JavaScript核心语法"}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("rendered")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        viewMode === "rendered"
                          ? "bg-blue-600 text-purple-100"
                          : "text-gray-100 hover:text-purple-100"
                      }`}
                    >
                      渲染视图
                    </button>
                    <button
                      onClick={() => setViewMode("source")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        viewMode === "source"
                          ? "bg-blue-600 text-purple-100"
                          : "text-gray-100 hover:text-purple-100"
                      }`}
                    >
                      源代码
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveAssignment(null)}
                    className="text-gray-100 hover:text-purple-100 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {viewMode === "rendered" ? (
                <div className="bg-white rounded-xl overflow-hidden">
                  <iframe
                    src={
                      activeAssignment === "first"
                        ? "/第一次.html"
                        : "/第三次.html"
                    }
                    className="w-full h-[600px] border-0"
                    title={
                      activeAssignment === "first" ? "第一次作业" : "第三次作业"
                    }
                  />
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {activeAssignment === "first"
                      ? firstAssignmentContent
                      : thirdAssignmentContent}
                  </pre>
                </div>
              )}

              <div className="mt-6 flex space-x-4">
                <a
                  href={
                    activeAssignment === "first"
                      ? "/第一次.html"
                      : "/第三次.html"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-purple-100 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <span>🔗</span>
                  <span>在新窗口打开</span>
                </a>

                {viewMode === "source" && (
                  <button
                    onClick={() => {
                      const content =
                        activeAssignment === "first"
                          ? firstAssignmentContent
                          : thirdAssignmentContent;
                      navigator.clipboard.writeText(content);
                    }}
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-purple-100 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <span>📋</span>
                    <span>复制代码</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {!activeAssignment && (
            <div className="text-center text-gray-100 py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg">点击上方作业卡片查看详细内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
