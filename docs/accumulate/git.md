
# Git知识
本文主要介绍了git使用SSH密钥、入门知识、分支管理以及常用命令，掌握了一下内容，你就可以轻松的在工作送使用Git了。

## SSH密钥
git使用https协议，每次pull, push都要输入密码，相当的烦。
使用git协议，然后使用ssh密钥。这样可以省去每次都输密码。

需要三个步骤：

一、本地生成密钥对；

二、设置github上的公钥；

三、修改git的remote url为git协议。

### 1、生成密钥
大多数 Git 服务器都会选择使用 SSH 公钥来进行授权。系统中的每个用户都必须提供一个公钥用于授权，没有的话就要生成一个。生成公钥的过程在所有操作系统上都差不多。首先先确认一下是否已经有一个公钥了。SSH 公钥默认储存在账户的主目录下的 ~/.ssh 目录。进去看看：

```
$ cd ~/.ssh 
$ ls
authorized_keys2  id_dsa       known_hosts config            id_dsa.pub
```
关键是看有没有用 something 和 something.pub 来命名的一对文件，这个 something 通常就是 id_dsa 或 id_rsa。有 .pub 后缀的文件就是公钥，另一个文件则是密钥。假如没有这些文件，或者干脆连 .ssh 目录都没有，可以用 ssh-keygen 来创建。该程序在 Linux/Mac 系统上由 SSH 包提供，而在 Windows 上则包含在 MSysGit 包里：
```
$ ssh-keygen -t rsa -C "your_email@youremail.com"

# Creates a new ssh key using the provided email # Generating public/private rsa key pair. 

# Enter file in which to save the key (/home/you/.ssh/id_rsa):
```
直接Enter就行。然后，会提示你输入密码，如下(建议输一个，安全一点，当然不输也行)：
```
Enter passphrase (empty for no passphrase): [Type a passphrase] 
# Enter same passphrase again: [Type passphrase again]
```
完了之后，大概是这样。
```
Your identification has been saved in /home/you/.ssh/id_rsa. 
# Your public key has been saved in /home/you/.ssh/id_rsa.pub. 
# The key fingerprint is: # 01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db your_email@youremail.com
```
这样。你本地生成密钥对的工作就做好了。

### 2、添加公钥到你的github帐户
2-1、查看你生成的公钥：大概如下：
```
$ cat ~/.ssh/id_rsa.pub  

ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlE
LEVf4h9lFX5QVkbPppSwg0cda3 Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA t3FaoJoAsncM1Q9x5+3V
0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx NrRFi9wrf+M7Q== schacon@agadorlaptop.local
```
2-2、登陆你的github帐户。然后 Account Settings -> 左栏点击 SSH Keys -> 点击 Add SSH key

2-3、然后你复制上面的公钥内容，粘贴进“Key”文本域内。 title域，你随便填一个都行。

2-4、完了，点击 Add key。

这样，就OK了。然后，验证下这个key是不是正常工作。

```
$ ssh -T git@github.com
# Attempts to ssh to github
```
如果，看到：
```
Hi username! You've successfully authenticated, but GitHub does not # provide shell access.
```
就表示你的设置已经成功了。

### 3、修改你本地的ssh remote url. 不用https协议，改用git 协议
** 确保：**

你已经init了一个空仓库。

你已经把远程git的url添加到了本地git仓库的配置文件

================================================

可以用git remote -v 查看你当前的remote url
```
$ git remote -v
origin https://github.com/someaccount/someproject.git (fetch)
origin https://github.com/someaccount/someproject.git (push)
```
可以看到是使用https协议进行访问的。

你可以使用浏览器登陆你的github，在上面可以看到你的ssh协议相应的url。类似如下：

```
git@github.com:someaccount/someproject.git
```

这时，你可以使用 git remote set-url 来调整你的url。

```
git remote set-url origin git@github.com:someaccount/someproject.git
```

完了之后，你便可以再用 git remote -v 查看一下。
```
$ git remote -v
origin https://git@github.com:someaccount/someproject.git (fetch)
origin https://git@github.com:someaccount/someproject.git (push)
```
OK。

至此，你就可以省去输入密码的麻烦，也可以很安全的进行push,pull,fetch,checkout等操作了。

你可以用git fetch, git pull , git push。

「注意：」

第一次使用git push之前，需要对git push进行配置：

1.simple方式：
```
git config --global push.default.simple
```
2.matching方式：
```
git config --global push.default.matching

matching means git push will push all your local branches to the ones with the same name on the remote. This makes it easy to accidentally push a branch you didn't intend to.
```
matching与simple方式的push的区别是：matching会把你所有本地的分支push到远程仓库中对应匹配的分支。
```
simple means git push will push only the current branch to the one that git pull would pull from, and also checks that their names match. This is a more intuitive behavior, which is why the default is getting changed to this.
```
simple方式，只会push你已经从远程仓库pull过的分支，意思是你曾经pull了分支dev，那么当你使用缺省git push时，当前分支为dev，远程分支dev就会收到你的commit。

3.或者使用git push [远程仓库] [本地分支]

## 入门知识
### Git简介
Git是目前世界上最先进的分布式版本控制系统。

1. 版本控制

典型代表Word文件的编辑，你的文件夹中是不是有这样的情况：
```
word20160301.doc
word备份的.doc
word(小王).doc
word-03.doc
word.doc
```
而某一天，你可能需要以前修改过的版本（因为，经常会遇到这种抽风的上司或者客户）

而由版本控制给你带来的是：
```
版本    用户    说明    日期
1   张三    删除了软件服务条款5    7/12 10:38
2    张三    增加了License人数限制    7/12 18:09
3    李四    财务部门调整了合同金额    7/13 9:51
4    张三    延长了免费升级周期    7/14 15:17
```
而且，你想退回到哪里，就可以退回到哪里！

记住第一个关键词：（无尽的）后悔药

2. 分布式 VS 集中式

集中式，典型的代表就是SVN，版本库是集中存放在中央服务器的，而干活的时候，用的都是自己的电脑，所以要先从中央服务器取得最新的版本，然后开始干活，干完活了，再把自己的活推送给中央服务器。

分布式，分布式版本控制系统根本没有“中央服务器”，每个人的电脑上都是一个完整的版本库，分布式版本控制系统的安全性要高很多，因为每个人电脑里都有完整的版本库，某一个人的电脑坏掉了不要紧，随便从其他人那里复制一个就可以了。而集中式版本控制系统的中央服务器要是出了问题，所有人都没法干活了。

Git不单是不必联网这么简单，Git更强大的是分支管理。后面讲到~~~~~

记住第二个关键词：分布式

### Git环境搭建
#### 安装Git
在Linux(Debian)上安装Git:
apt-get install git
Mac OS X上安装Git：
第一种方法是安装homebrew，然后通过homebrew安装Git，具体方法请参考homebrew的文档：http://brew.sh/。
第二种方法更简单，也是推荐的方法，就是直接从AppStore安装Xcode，Xcode集成了Git，不过默认没有安装，你需要运行Xcode，选择菜单“Xcode”->“Preferences”，在弹出窗口中找到“Downloads”，选择“Command Line Tools”，点“Install”就可以完成安装了。
在Windows上安装Git
从这里https://git-for-windows.github.io/下载，双击安装
安装完成后，可以在右键菜单/开始菜单中找到“Git”->“Git Bash”，蹦出一个类似命令行窗口的东西，就说明Git安装成功！
全局变量设置
就像Java需要设置Path一样，Git需要设置一些全局变量。
```
“Git”->“Git Bash”

$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
```
设置用户与Email，相当于自报家门，让版本库有一个记录。注意：git config命令的--global是全局设置的意思。
```
任何一个命令或者参考：git [命令] --help来查看帮助，或者登陆官方来学习命令http://git-scm.com/doc
```
创建版本库
1. windows下，需要建立的版本库的地方，右键git bash->

```
$ git init
```

瞬间Git就把仓库建好了，而且告诉你是一个空的仓库（empty Git repository），细心的读者可以发现当前目录下多了一个.git的目录，这个目录是Git来跟踪管理版本库的，没事千万不要手动修改这个目录里面的文件，不然改乱了，就把Git仓库给破坏了。

PS:如果你没有看到.git目录，那是因为这个目录默认是隐藏的

2. Linux中：

如果，需要在learngit目录下建立一个Git仓库，可以如下操作

```
$ mkdir learngit
$ cd learngit
$ git init
```

你也可以这样:

```
$ git init learngit
```

试一试吧！

### 基本操作
#### Git工作区和暂存区:
我们看到目录为工作区(/learngit)；需要进行提交到版本库的文件放在暂存区（看不到，需要使用git status来查看）。

git status命令：可以让我们时刻掌握仓库当前的状态。

git diff命令：让我们查看文件与版本库中的区别。

获取远程仓库代码（前提是init之后）
1. 克隆仓库：

```
$ git clone [user@]example.com:path/to/repo.git/
```

2. 或者添加远程仓库：

使用git remote add命令，添加一个远程仓库的链接，命令格式：git remote add [远程仓库别名] [远程仓库地址]

```
$ git remote add origin git@github.com:michaelliao/learngit.git
```

3. 拉取代码。

如果已经被git管理的项目，则使用git pull和git fetch来管理代码的拉取与更新：

使用git pull拉取远程代码的HEAD头标记，即最新的代码。

命令格式：$ git pull <远程主机名> <远程分支名>:<本地分支名>

```
$ git pull 
```

#### 提交代码
把所有的文件更改提交到暂存区：

```
$ git add -a
```

为所有暂存区的代码写入日志并提交到本地仓库：

```
$ git commit -m "(something)"
```

把所有本地仓库的提交，更新到远程仓库：

```
$ git push
```

#### Git时光机
1. git log命令：查看每次修改的日志文件。

git log与git reflog的区别，记得几点：git log是顺着当前分支往前去查找提交记录，而git reflog并不像git log去遍历提交历史，它都不是仓库的一部分，它不包含推送、更新或者克隆，而是作为本地提交记录的清单。简单理解：本地后悔药。

2. git reset命令：回退命令。

首先，Git必须知道当前版本是哪个版本，在Git中，用HEAD表示当前版本，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100。

```
$ git reset --hard HEAD^
HEAD is now at ea34578 add distributed
```

回退add命令提交到缓存区的文件，并不会把文件恢复缓存区，需要区别（3）git checkout命令：

```
$ git reset HEAD 
```

3. git checkout --命令:丢弃缓存区文件的修改，把文件恢复到git add之前的状态。

4. git diff HEAD --命令可以查看工作区和版本库里面最新版本的区别

5. git rm删除文件。

#### 标签管理
发布一个版本时，我们通常先在版本库中打一个标签，这样，就唯一确定了打标签时刻的版本。将来无论什么时候，取某个标签的版本，就是把那个打标签的时刻的历史版本取出来。所以，标签也是版本库的一个快照。

Git的标签虽然是版本库的快照，但其实它就是指向某个commit的指针（跟分支很像对不对？但是分支可以移动，标签不能移动），所以，创建和删除标签都是瞬间完成的。

1. 创建标签（快照）

在Git中打标签非常简单，首先，切换到需要打标签的分支上：

```
$ git branch
* dev
  master
$ git checkout master
Switched to branch 'master'
```

然后，敲命令git tag就可以打一个新标签：

```
$ git tag v1.0
```

可以用命令git tag查看所有标签：

```
$ git tag
v1.0
```

默认标签是打在最新提交的commit上的。有时候，如果忘了打标签，比如，现在已经是周五了，但应该在周一打的标签没有打，怎么办？

方法是找到历史提交的commit id，然后打上就可以了：

```
$ git log --pretty=oneline --abbrev-commit
6a5819e merged bug fix 101
cc17032 fix bug 101
7825a50 merge with no-ff
6224937 add merge
59bc1cb conflict fixed
400b400 & simple
75a857c AND simple
fec145a branch test
d17efd8 remove test.txt
```

比方说要对add merge这次提交打标签，它对应的commit id是6224937，敲入命令：

```
$ git tag v0.9 6224937
```

再用命令git tag查看标签：

```
$ git tag
v0.9
v1.0
```

注意，标签不是按时间顺序列出，而是按字母排序的。

可以用**git show**查看标签信息：

```
$ git show v0.9
commit 622493706ab447b6bb37e4e2a2f276a20fed2ab4
Author: Brian 
Date:   Thu Aug 22 11:22:08 2013 +0800
    add merge
```

可以看到，v0.9确实打在add merge这次提交上。

还可以创建带有说明的标签，用-a指定标签名，-m指定说明文字：

```
   $ git tag -a v0.1 -m "version 0.1 released" 3628164
```

用命令git show可以看到说明文字：

```
   $ git show v0.1
   tag v0.1
   Tagger: Brian 
   Date:   Mon Aug 26 07:28:11 2013 +0800
   
   version 0.1 released
   
   commit 3628164fb26d48395383f8f31179f24e0882e1e0
   Author: Brian 
   Date:   Tue Aug 20 15:11:49 2013 +0800
   
   append GPL
```

还可以通过-s用私钥签名一个标签：

```
   $ git tag -s v0.2 -m "signed version 0.2 released" fec145a
```


2. 标签操作（删除，推送）

命令git push origin可以推送一个本地标签；

命令git push origin --tags可以推送全部未推送过的本地标签；

命令git tag -d可以删除一个本地标签；

命令git push origin :refs/tags/可以删除一个远程标签。

如果标签已经推送到远程，要删除远程标签就麻烦一点，先从本地删除：

```
$ git tag -d v0.9
Deleted tag 'v0.9' (was 6224937)
```

然后，从远程删除。删除命令也是push，但是格式如下：

```
$ git push origin :refs/tags/v0.9
To git@github.com:michaelliao/learngit.git
 - [deleted]         v0.9
```

#### 使用.gitignore忽略文件
有些时候，你必须把某些文件放到Git工作目录中，但又不能提交它们，比如保存了数据库密码的配置文件啦，等等，每次git status都会显示Untracked files …，有强迫症的童鞋心里肯定不爽。

好在Git考虑到了大家的感受，这个问题解决起来也很简单，在Git工作区的根目录下创建一个特殊的.gitignore文件，然后把要忽略的文件名填进去，Git就会自动忽略这些文件。

不需要从头写.gitignore文件，GitHub已经为我们准备了各种配置文件，只需要组合一下就可以使用了。所有配置文件可以直接在线浏览：https://github.com/github/gitignore

忽略文件的原则是：

+ 忽略操作系统自动生成的文件，比如缩略图等；
+ 忽略编译生成的中间文件、可执行文件等，也就是如果一个文件是通过另一个文件自动生成的，那自动生成的文件就没必要放进版本库，比如Java编译产生的.class文件；
+ 忽略你自己的带有敏感信息的配置文件，比如存放口令的配置文件。
举个例子：

假设你在Windows下进行Python开发，Windows会自动在有图片的目录下生成隐藏的缩略图文件，如果有自定义目录，目录下就会有Desktop.ini文件，因此你需要忽略Windows自动生成的垃圾文件：

```
# Windows:
Thumbs.db
ehthumbs.db
Desktop.ini
```

然后，继续忽略Python编译产生的.pyc、.pyo、dist等文件或目录：

```
# Python:
*.py[cod]
*.so
*.egg
*.egg-info
dist
build
```

加上你自己定义的文件，最终得到一个完整的.gitignore文件，内容如下：

```
# Windows:
Thumbs.db
ehthumbs.db
Desktop.ini

# Python:
*.py[cod]
*.so
*.egg
*.egg-info
dist
build

# My configurations:
db.ini
deploy_key_rsa
```

最后一步就是把.gitignore也提交到Git，就完成了！当然检验.gitignore的标准是git status命令是不是说working directory clean。

使用Windows的童鞋注意了，如果你在资源管理器里新建一个.gitignore文件，它会非常弱智地提示你必须输入文件名，但是在文本编辑器里“保存”或者“另存为”就可以把文件保存为.gitignore了。

或者可以使用以下方法，在git bash中输入以下命令：

```
$ touch .gitignore
$ vi .gitignore
```

Git忽略规则及.gitignore规则不生效的解决办法：

```
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

PS：注意–cached后面有一个”.”，add后面也有一个“.”

完成上述操作后，再重新修改.gitnore文件，并git add .添加文件到缓存区

#### 配置命令别名
有没有经常敲错命令？比如git status？status这个单词真心不好记。

如果敲git st就表示git status那就简单多了，当然这种偷懒的办法我们是极力赞成的。

我们只需要敲一行命令，告诉Git，以后st就表示status：

```
$ git config --global alias.st status
```

好了，现在敲git st看看效果。

当然还有别的命令可以简写，很多人都用co表示checkout，ci表示commit，br表示branch：

```
$ git config --global alias.co checkout
$ git config --global alias.ci commit
$ git config --global alias.br branch
```

以后提交就可以简写成：

```
$ git ci -m "bala bala bala..."
```

--global参数是全局参数，也就是这些命令在这台电脑的所有Git仓库下都有用。

在撤销修改一节中，我们知道，命令git reset HEAD file可以把暂存区的修改撤销掉（unstage），重新放回工作区。既然是一个unstage操作，就可以配置一个unstage别名：

```
$ git config --global alias.unstage 'reset HEAD'
```

当你敲入命令：

```
$ git unstage test.py
```

实际上Git执行的是：

```
$ git reset HEAD test.py
```

配置一个git last，让其显示最后一次提交信息：

```
$ git config --global alias.last 'log -1'
```

这样，用git last就能显示最近一次的提交：

```
$ git last
commit adca45d317e6d8a4b23f9811c3d7b7f0f180bfe2
Merge: bd6ae48 291bea8
Author: Michael Liao 
Date:   Thu Aug 22 22:49:22 2013 +0800

merge & fix hello.py
```

甚至还有人丧心病狂地把lg配置成了：

```
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

来看看git lg的效果：

为什么不早点告诉我？别激动，咱不是为了多记几个英文单词嘛！

#### 配置文件
配置Git的时候，加上--global是针对当前用户起作用的，如果不加，那只针对当前的仓库起作用。

配置文件放哪了？每个仓库的Git配置文件都放在.git/config文件中：

```
$ cat .git/config 
[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
    logallrefupdates = true
    ignorecase = true
    precomposeunicode = true
[remote "origin"]
    url = git@github.com:michaelliao/learngit.git
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
    remote = origin
    merge = refs/heads/master
[alias]
    last = log -1
```

别名就在[alias]后面，要删除别名，直接把对应的行删掉即可。

而当前用户的Git配置文件放在用户主目录下的一个隐藏文件.gitconfig中：

```
$ cat .gitconfig
[alias]
    co = checkout
    ci = commit
    br = branch
    st = status
[user]
    name = Your Name
    email = your@email.com
```

### Git恢复流程
当中心仓库由于不可抗拒因素而垮了之后：

项目Git恢复流程：

#### 方法一：恢复指定分支
1.注册账号→输入SSH keys→新建项目。

2.在原项目文件夹下，使用git remote -v命令查看

```
$ git remote -v
origin  git@192.168.1.222:kanlidy/HelloGit.git (fetch)
origin  git@192.168.1.222:kanlidy/HelloGit.git (push)
```

使用git remote remove origin删除原有仓库地址。

3.使用新的仓库地址：

```
git remote add origin [ssh仓库地址]
```

如：

```
git remote add origin ssh://git@github.com/kanlidy/HelloGit.git
```

4.添加文件，并Commit提交，最后push上远程指定分支

```
git add .

git commit -m "add my repo"

#这条命令会把当前分支，推送到远程的master分支
git push origin master 

#如果需要把dev分支，推送到远程的dev分支
git push origin dev:dev
```

#### 方法二：恢复项目所有分支:
```
git remote remove origin

git remote add origin [新的SSH仓库地址]

git push --mirror ssh://git@github.com/kanlidy/LearnPython.git
```

#### 本地多个SSH密钥文件
有的时候，不仅github使用ssh key，工作项目或者其他云平台可能也需要使用ssh key来认证，如果每次都覆盖了原来的id_rsa文件，那么之前的认证就会失效。这个问题我们可以通过在~/.ssh目录下增加config文件来解决。

1. 第一步依然是配置git用户名和邮箱

```
git config user.name "用户名"
git config user.email "邮箱"
```

2. 生成ssh key时同时指定保存的文件名

```
ssh-keygen -t rsa -f ~/.ssh/id_rsa.company -C "email"
```

上面的id_rsa.company就是我们指定的文件名，这时~/.ssh目录下会多出id_rsa.company和id_rsa.company.pub两个文件，id_rsa.company.pub里保存的就是我们要使用的key。

3. 新增并配置config文件

添加config文件

如果config文件不存在，先添加；存在则直接修改

```
touch ~/.ssh/config
```

在config文件里添加如下内容(User表示你的用户名)

```
Host 域名或者IP
    IdentityFile ~/.ssh/id_rsa.company
    User test
```

如：

```
Host 192.168.1.222
IdentityFile ~/.ssh/id_rsa.company
User kanlidy
```

上传key到云平台后台(省略)

测试ssh key是否配置成功

ssh -T git@域名或者IP

如：

ssh -T git@192.168.1.222 -p 8082

成功的话会显示：

Welcome to GitLab, kanlidy!

至此，本地便成功配置多个ssh key。日后如需添加，则安装上述配置生成key，并修改config文件即可。

### Git分支管理
还记得《星际穿越》中的平行空间吗？两个独立的空间互不干扰，当你正在电脑前努力学习Git的时候，另一个你正在另一个平行宇宙里努力学习SVN。在某一个时间点，两个平行的时空合并了，结果，你既学会了Git又学会了SVN！

**分支在实际中有什么用呢？**假设你准备开发一个新功能，但是需要两周才能完成，第一周你写了50%的代码，如果立刻提交，由于代码还没写完，不完整的代码库会导致别人不能干活了。如果等代码全部写完再一次提交，又存在丢失每天进度的巨大风险。

**分支的独立性：**现在有了分支，就不用怕了。你创建了一个属于你自己的分支，别人看不到，还继续在原来的分支上正常工作，而你在自己的分支上干活，想提交就提交，直到开发完毕后，再一次性合并到原来的分支上，这样，既安全，又不影响别人工作。

**git分支的高效：**其他版本控制系统如SVN等都有分支管理，但是用过之后你会发现，这些版本控制系统创建和切换分支比蜗牛还慢，简直让人无法忍受，结果分支功能成了摆设，大家都不去用。

但Git的分支是与众不同的，无论创建、切换和删除分支，Git在1秒钟之内就能完成！无论你的版本库是1个文件还是1万个文件。

#### 理解HEAD头指针
一开始的时候，HEAD头指针指向的是主分支，即master分支。而HEAD指向的是当前分支，master指向的是提交。

如果，在master分支上新建了一个分支dev，此时HEAD指向了dev，Git建立分支的过程很快，因为除了增加一个dev指针，改改HEAD的指向，工作区的文件都没有任何变化！

不过，从现在开始，对工作区的修改和提交就是针对dev分支了，比如新提交一次后，dev指针往前移动一步，而master指针不变。

#### 创建dev分支
创建分支使用git branch命令，命令格式：git branch [分支别名]

```
$ git branch dev
```

可以使用$ git branch来查看所有本地分支，$ git branch -a查看所有分支（包括远程分支）。

使用git checkout [分支名]切换到对应的分支，如：

```
$ git checkout dev 
```

此时，HEAD头指针会指向dev，如果在dev上提交，dev指针会往前移，而其他分支不变。（master分支及指针不变）

当使用git checkout master时，HEAD头指针会重新指向master，此时再提交，master指针会往前移。

这个过程，需要自己亲身的试验才能体会到它们的作用和变化。

```
$gitk
```

使用Git自带的图形界面，可以很好的来管理分支。

#### 冲突解决
冲突产生：当两个分支中修改的相同的文件并提交（add->commit），合并(merge)这两个分支的时候，会产生冲突。

如下例：

```
$ git checkout -b feature1
```

1. 在新的feature1分支下修改了readme.txt：

```
vi readme.txt
//修改，添加Creating a new branch is quick AND simple.
$ git add readme.txt 
$ git commit -m "AND simple"
```

2. 切换到master分支：
```
$ git checkout master

vi readme.txt
//在`master`分支上把readme.txt文件的最后一行改为：Creating a new branch is quick & simple
$ git add readme.txt 
$ git commit -m "& simple"
```

3. 试图合并master与feature1：

```
$ git merge feature1
Auto-merging readme.txt
CONFLICT (content): Merge conflict in readme.txt
Automatic merge failed; fix conflicts and then commit the result.
```
（1）使用：$ git status来查看冲突文件：

```
$ git status
# On branch master
# Your branch is ahead of 'origin/master' by 2 commits.
#
# Unmerged paths:
#   (use "git add/rm ..." as appropriate to mark resolution)
#
#       both modified:      readme.txt
#
no changes added to commit (use "git add" and/or "git commit -a")
```

（2）直接查看readme.txt文件内容：

```
Git is a distributed version control system.
Git is free software distributed under the GPL.
Git has a mutable index called stage.
Git tracks changes of files.
<<<<<<< HEAD
Creating a new branch is quick & simple.
=======
Creating a new branch is quick AND simple.
>>>>>>> feature1
```

Git用<<<<<<<，=======，>>>>>>>标记出不同分支的内容，我们修改如下后保存：

```
Creating a new branch is quick and simple.
```

4. 再提交：

```
$ git add readme.txt 
$ git commit -m "conflict fixed"
[master 59bc1cb] conflict fixed
```

PS: 用带参数的git log也可以看到分支的合并情况：

```
$ git log --graph --pretty=oneline --abbrev-commit
*   59bc1cb conflict fixed
|\
| * 75a857c AND simple
* | 400b400 & simple
|/
* fec145a branch test
...
```

5. 最后，删除feature1分支：

```
$ git branch -d feature1
Deleted branch feature1 (was 75a857c).
```

### 分支管理策略
通常，合并分支时，如果可能，Git会用Fast forward模式，但这种模式下，删除分支后，会丢掉分支信息。

如果要强制禁用Fast forward模式，Git就会在merge时生成一个新的commit，这样，从分支历史上就可以看出分支信息。

下面我们实战一下--no-ff方式的git merge：

首先，仍然创建并切换dev分支：

```
$ git checkout -b dev
Switched to a new branch 'dev'
```

修改readme.txt文件，并提交一个新的commit：

```
$ git add readme.txt 
$ git commit -m "add merge"
[dev 6224937] add merge
 1 file changed, 1 insertion(+)
```

现在，我们切换回master：

```
$ git checkout master
Switched to branch 'master
```

准备合并dev分支，请注意--no-ff参数，表示禁用Fast forward：

```
$ git merge --no-ff -m "merge with no-ff" dev
Merge made by the 'recursive' strategy.
 readme.txt |    1 +
 1 file changed, 1 insertion(+)
```

分支策略

在实际开发中，我们应该按照几个基本原则进行分支管理：

首先，master分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；

那在哪干活呢？干活都在dev分支上，也就是说，dev分支是不稳定的，到某个时候，比如1.0版本发布时，再把dev分支合并到master上，在master分支发布1.0版本；

你和你的小伙伴们每个人都在dev分支上干活，每个人都有自己的分支，时不时地往dev分支上合并就可以了。

所以，团队合作的分支看起来就像这样：

#### Bug分支
软件开发中，bug就像家常便饭一样。有了bug就需要修复，在Git中，由于分支是如此的强大，所以，每个bug都可以通过一个新的临时分支来修复，修复后，合并分支，然后将临时分支删除。

当你接到一个修复一个代号101的bug的任务时，很自然地，你想创建一个分支issue-101来修复它，但是，等等，当前正在dev上进行的工作还没有提交：

```
$ git status
# On branch dev
# Changes to be committed:
#   (use "git reset HEAD ..." to unstage)
#
#       new file:   hello.py
#
# Changes not staged for commit:
#   (use "git add ..." to update what will be committed)
#   (use "git checkout -- ..." to discard changes in working directory)
#
#       modified:   readme.txt
#
```

并不是你不想提交，而是工作只进行到一半，还没法提交，预计完成还需1天时间。但是，必须在两个小时内修复该bug，怎么办？

幸好，Git还提供了一个stash功能，可以把当前工作现场“储藏”起来，等以后恢复现场后继续工作：

```
$ git stash
Saved working directory and index state WIP on dev: 6224937 add merge
HEAD is now at 6224937 add merge
```

现在，用git status查看工作区，就是干净的（除非有没有被Git管理的文件），因此可以放心地创建分支来修复bug。

首先确定要在哪个分支上修复bug，假定需要在master分支上修复，就从master创建临时分支：

```
$ git checkout master
$ git checkout -b issue-101
```

现在修复bug，需要把“Git is free software …”改为“Git is a free software …”，然后提交：

```
$ git add readme.txt 
$ git commit -m "fix bug 101"
```

修复完成后，切换到master分支，并完成合并，最后删除issue-101分支：

```
$ git checkout master
$ git merge --no-ff -m "merged bug fix 101" issue-101
$ git branch -d issue-101
```

太棒了，原计划两个小时的bug修复只花了5分钟！现在，是时候接着回到dev分支干活了！

```
$ git checkout dev
Switched to branch 'dev'
$ git status
# On branch dev
nothing to commit (working directory clean)
```

工作区是干净的，刚才的工作现场存到哪去了？用git stash list命令看看：

```
$ git stash list
stash@{0}: WIP on dev: 6224937 add merge
```

工作现场还在，Git把stash内容存在某个地方了，但是需要恢复一下，有两个办法：

**一种方式：**用git stash apply恢复，但是恢复后，stash内容并不删除，你需要用git stash drop来删除；

**另一种方式：**是用git stash pop，恢复的同时把stash内容也删了：

```
$ git stash pop
# On branch dev
# Changes to be committed:
#   (use "git reset HEAD ..." to unstage)
#
#       new file:   hello.py
#
# Changes not staged for commit:
#   (use "git add ..." to update what will be committed)
#   (use "git checkout -- ..." to discard changes in working directory)
#
#       modified:   readme.txt
#
Dropped refs/stash@{0} (f624f8e5f082f2df2bed8a4e09c12fd2943bdd40)
```

再用git stash list查看，就看不到任何stash内容了：

```
$ git stash list
```

你可以多次stash，恢复的时候，先用git stash list查看，然后恢复指定的stash，用命令：

```
$ git stash apply stash@{0}
```

#### 删除分支
软件开发中，总有无穷无尽的新的功能要不断添加进来。

添加一个新功能时，你肯定不希望因为一些实验性质的代码，把主分支搞乱了，所以，每添加一个新功能，最好新建一个feature分支，在上面开发，完成后，合并，最后，删除该feature分支。

还记得吗？

建立新的分支:git checkout -b feature-new

工作提交：git add --a，git commit -m "something..."

回到dev开发分支：git checkout dev

合并分支：git merge --no-ff feature-new

一切顺利的话，feature分支和bug分支是类似的，合并，然后删除。

但是，就在此时，接到上级命令，因经费不足，新功能必须取消！虽然白干了，但是这个分支还是必须就地销毁：

（1）如果没有合并之前，可以简单的使用git branch -d [分支名]来删除分支（使用-D命令，强制删除分支）

（2）如果已经合并，除了上面的需要删除以外，还需要使用前面讲到的git reset --hard HEAD^来退回到上一个版本。

PS:分支的删除，不会影响到其他分支上已经合并的分支内容。

#### 多人协作
多人协作的工作模式通常是这样：

首先，可以试图用git push origin branch-name推送自己的修改；

如果推送失败，则因为远程分支比你的本地更新，需要先用git pull试图合并；

如果合并有冲突，则解决冲突，并在本地提交；

没有冲突或者解决掉冲突后，再用git push origin branch-name推送就能成功！

如果git pull提示“no tracking information”，则说明本地分支和远程分支的链接关系没有创建，用命令git branch --set-upstream branch-name origin/branch-name。

这就是多人协作的工作模式，一旦熟悉了，就非常简单。

注：所有工作流建立在已经建立了个人账户，并添加了SSH key到个人的文档中。见Profile Settings → SSH keys → Before you can add an SSH key you need to [generate it].

1. 普通开发人员

情况一：程序员A是后加入到项目中的，项目已经存在代码仓库。

如：git@github.com:kanlidy/HelloGit.git

（1）克隆版本仓库

```
git clone git@github.com:kanlidy/HelloGit.git
```

（2）建立分支
```
git checkout -b (分支名)
```

（3）提交代码

查看代码修改的状态：

```
git status 
```

添加到工作区：

```
git add .
```

提交到本地仓库：

```
git commit -m "（写下提交日志）"
```
推送到服务器：

```
git push origin 分支名
```

（4）在服务器上建立Merge Request，把自己的提交到远程的分支，Merge到Dev(开发分支)

**情况二：程序员B是在一个新项目中，本地有一些代码，需要建立一个版本控制仓库**

（1）在项目目录下，初始化仓库

```
git init
```

（2）添加到git版本控制系统：

```
git remote add origin git@github.com:kanlidy/HelloGit.git
```

（3）添加所有已经存在的文件到项目中：

```
git add .
```

（4）提交代码到本地仓库：

```
git commit -m "写下日志"
```

（5）提交代码远程服务器

```
git push origin <本地分支名>：<远程分支名>

git push origin master:master
```

对于单人项目，情况二足以满足代码控制要求。→吕扬、刘扬。

2. 仓库管理人员

**情况一：手工合并代码**

（1）在指定分支上获取更新

```
git checkout <指定分支>
```

（2）拉取服务器上的代码

```
git pull origin <指定分支>
```

（3）切换到dev，并获取dev上的更新，合并指定分支上的代码

```
git checkout dev
git pull origin dev
git merge <指定分支>
```

**情况二：直接在gitlab上进行操作**

直接点击accept merge request进行分支合并。

代码回撤参考git reset命令，获取更新参考git fetch命令，分支查看git branch，逻辑流程图gitk，状态命令git status,日志命令git reflog与git log

### Git常用命令
这一部分介绍了git的常用命令，如git clone、git pull、git push等等。

**git clone**
该命令会在本地主机生成一个目录，与远程主机的版本库同名。如果要指定不同的目录名，可以将目录名作为git clone命令的第二个参数。

克隆仓库git clone的语法：

```
$ git clone <版本库的网址> <本地目录名>
```

git clone支持多种协议，除了HTTP(s)以外，还支持SSH、Git、本地文件协议等，下面是一些例子。

```
$ git clone http[s]://example.com/path/to/repo.git/
$ git clone ssh://example.com/path/to/repo.git/
$ git clone git://example.com/path/to/repo.git/
$ git clone /opt/git/project.git 
$ git clone file:///opt/git/project.git
$ git clone ftp[s]://example.com/path/to/repo.git/
$ git clone rsync://example.com/path/to/repo.git/
```

SSH协议还有另一种写法。

```
$ git clone [user@]example.com:path/to/repo.git/
```

还可以使用-b和标签名来克隆指定的分支和tags：

```
git clone -b r01 https://github.com/xxxx/xxxx.git
```

**git remote**

为了便于管理，Git要求每个远程主机都必须指定一个主机名。git remote命令就用于管理主机名。
不带选项的时候，git remote命令列出所有远程主机。

```
$ git remote
origin
```

使用-v选项，可以参看远程主机的网址。

```
$ git remote -v
origin  git@github.com:jquery/jquery.git (fetch)
origin  git@github.com:jquery/jquery.git (push)
```

上面命令表示，当前只有一台远程主机，叫做origin，以及它的网址。
克隆版本库的时候，所使用的远程主机自动被Git命名为origin。如果想用其他的主机名，需要用git clone命令的-o选项指定。

```
$ git clone -o jQuery https://github.com/jquery/jquery.git
$ git remote
jQuery
```

上面命令表示，克隆的时候，指定远程主机叫做jQuery。
git remote show命令加上主机名，可以查看该主机的详细信息。

```
$ git remote show <主机名>
git remote add命令用于添加远程主机。

$ git remote add <主机名> <网址>
git remote rm命令用于删除远程主机。

$ git remote rm <主机名>
git remote rename命令用于远程主机的改名。

$ git remote rename <原主机名> <新主机名>
```
**git fetch**
一旦远程主机的版本库有了更新（Git术语叫做commit），需要将这些更新取回本地，这时就要用到git fetch命令。
```
$ git fetch <远程主机名>
```
上面命令将某个远程主机的更新，全部取回本地。
git fetch命令通常用来查看其他人的进程，因为它取回的代码对你本地的开发代码没有影响。
默认情况下，git fetch取回所有分支（branch）的更新。如果只想取回特定分支的更新，可以指定分支名。
```
$ git fetch <远程主机名> <分支名>
```
比如，取回origin主机的master分支。
```
$ git fetch origin master
```
所取回的更新，在本地主机上要用”远程主机名/分支名”的形式读取。比如origin主机的master，就要用origin/master读取。
git branch命令的-r选项，可以用来查看远程分支，-a选项查看所有分支。
```
$ git branch -r
origin/master

$ git branch -a
* master
  remotes/origin/master
```
上面命令表示，本地主机的当前分支是master，远程分支是origin/master。
取回远程主机的更新以后，可以在它的基础上，使用git checkout命令创建一个新的分支。
```
$ git checkout -b newBrach origin/master
```
上面命令表示，在origin/master的基础上，创建一个新分支。
此外，也可以使用git merge命令或者git rebase命令，在本地分支上合并远程分支。
```
$ git merge origin/master
# 或者
$ git rebase origin/master
```
上面命令表示在当前分支上，合并origin/master。

**git pull**
git pull命令的作用是，取回远程主机某个分支的更新，再与本地的指定分支合并。它的完整格式稍稍有点复杂。
```
$ git pull <远程主机名> <远程分支名>:<本地分支名>
```
比如，取回origin主机的next分支，与本地的master分支合并，需要写成下面这样。
```
$ git pull origin next:master
```
如果远程分支是与当前分支合并，则冒号后面的部分可以省略。
```
$ git pull origin next
```
上面命令表示，取回origin/next分支，再与当前分支合并。实质上，这等同于先做git fetch，再做git merge。
```
$ git fetch origin
$ git merge origin/next
```
在某些场合，Git会自动在本地分支与远程分支之间，建立一种追踪关系（tracking）。比如，在git clone的时候，所有本地分支默认与远程主机的同名分支，建立追踪关系，也就是说，本地的master分支自动”追踪”origin/master分支。
Git也允许手动建立追踪关系。
```
git branch --set-upstream master origin/next
```
上面命令指定master分支追踪origin/next分支。
如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名。
```
$ git pull origin
```
上面命令表示，本地的当前分支自动与对应的origin主机”追踪分支”（remote-tracking branch）进行合并。
如果当前分支只有一个追踪分支，连远程主机名都可以省略。
```
$ git pull
```
上面命令表示，当前分支自动与唯一一个追踪分支进行合并。
如果合并需要采用rebase模式，可以使用--rebase选项。
```
$ git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
```
如果远程主机删除了某个分支，默认情况下，git pull 不会在拉取远程分支的时候，删除对应的本地分支。这是为了防止，由于其他人操作了远程主机，导致git pull不知不觉删除了本地分支。
但是，你可以改变这个行为，加上参数 -p 就会在本地删除远程已经删除的分支。
```
$ git pull -p
# 等同于下面的命令
$ git fetch --prune origin 
$ git fetch -p
```
**git push**
git push命令用于将本地分支的更新，推送到远程主机。它的格式与git pull命令相仿。
```
$ git push <远程主机名> <本地分支名>:<远程分支名>
```
注意，分支推送顺序的写法是<来源地>:<目的地>，所以git pull是<远程分支>:<本地分支>，而git push是<本地分支>:<远程分支>。
如果省略远程分支名，则表示将本地分支推送与之存在”追踪关系”的远程分支（通常两者同名），如果该远程分支不存在，则会被新建。
```
$ git push origin master
```
上面命令表示，将本地的master分支推送到origin主机的master分支。如果后者不存在，则会被新建。
如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。
```
$ git push origin :master
# 等同于
$ git push origin --delete master
```
上面命令表示删除origin主机的master分支。
如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。
```
$ git push origin
```
上面命令表示，将当前分支推送到origin主机的对应分支。
如果当前分支只有一个追踪分支，那么主机名都可以省略。
```
$ git push
```
如果当前分支与多个主机存在追踪关系，则可以使用-u选项指定一个默认主机，这样后面就可以不加任何参数使用git push。
```
$ git push -u origin master
```
上面命令将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push了。
不带任何参数的git push，默认只推送当前分支，这叫做simple方式。此外，还有一种matching方式，会推送所有有对应的远程分支的本地分支。Git 2.0版本之前，默认采用matching方法，现在改为默认采用simple方式。如果要修改这个设置，可以采用git config命令。
```
$ git config --global push.default matching
# 或者
$ git config --global push.default simple
```
还有一种情况，就是不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机，这时需要使用–all选项。
```
$ git push --all origin
```
上面命令表示，将所有本地分支都推送到origin主机。
如果远程主机的版本比本地版本更新，推送时Git会报错，要求先在本地做git pull合并差异，然后再推送到远程主机。这时，如果你一定要推送，可以使用--force选项。
```
$ git push --force origin 
```
上面命令使用--force选项，结果导致远程主机上更新的版本被覆盖。除非你很确定要这样做，否则应该尽量避免使用--force选项。
最后，git push不会推送标签（tag），除非使用--tags选项。
```
$ git push origin --tags
```
以上就是关于Git你需要知道的知识点啦，掌握以上知识点，你在工作上就可以轻松玩转Git版本控制了。


