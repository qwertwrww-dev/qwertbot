const { exec } = require("child_process");

exec("npx prisma db push", (error, stdout, stderr) => {

  if (error) {
    console.error(error);
    return;
  }

  console.log(stdout);
  console.error(stderr);

});
