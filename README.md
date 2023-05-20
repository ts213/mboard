#### Docker preview installation:
```shell
# 1. Сlone the repo:
git clone https://github.com/ts213/m-board.git
# 2. Change the directory:
cd m-board 
# 3. make a copy of .env.example file; use "copy" on Windows
cp .env.example .env
# 4. Download Docker images, then build and run containers:
docker compose up
# 5. After successful installation, it should be running at:
http://localhost:8080/
# 6. Shut it down after with "ctrl-c"
``` 


#### Development installation; installation without Docker:
TBD

---
<sub>
Refer to .env file for various settings.
<br>
Docker files take up quite a space, consider removing them if you don't need them.   
<code>docker system prune --all</code>
will remove <b>ALL</b> containers and images 
</sub>
