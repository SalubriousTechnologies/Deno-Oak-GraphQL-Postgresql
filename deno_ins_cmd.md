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


# Install denon 

```
deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts

```

**OR**

```

deno install -qAf --unstable https://raw.githubusercontent.com/nnmrts/denon/patch-4/denon.ts

```
