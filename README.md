<!DOCTYPE html>
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
          
