# 双生塔
这是一个服务器存活检测及告警系统，至少需要两台主机来保持相互告警，所以称之为双生塔。

- 主塔： 一个系统中只有一个，独立启动，当从塔链接后开始对从塔存活检测，如果超过指定失败次数仍无法检测到从塔，则发送告警邮件
- 从塔： 一个系统中可以有多个，主塔启动后才能启动，持续对主塔存活检测，如果超过指定失败次数仍无法检测到主塔，则发送告警邮件

注意，主塔挂掉之后所有从塔都会发送告警邮件

## 安装

```
git clone xxx/twin-tower.git
cd twin-tower
npm install
```


## 主塔

配置

```
cp main-config-example.json main-config.json
vi main-config.json
```

启动

```
npm run maintower
```

## 从塔

配置

```
cp slave-config-example.json slave-config.json
vi slave-config.json
```

启动

```
npm run slavetower
```

## 其他
此系统基于expressjs，可独立运行，也可参考main.js/slave.js讲此逻辑集成到现有的express项目中