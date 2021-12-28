**Installation command for set-up deno**

```
curl -fsSL https://deno.land/x/install/install.sh | sh

```

**After installing it update .bashrc file in your profile directory:**

```
sudo nano ~/.bashrc

```

then add these two lines in the file

```
 export DENO_INSTALL="/$HOME/.deno"
 export PATH="$DENO_INSTALL/bin:$PATH"

```

finally run the following command 

```
source ~/.bashrc

```