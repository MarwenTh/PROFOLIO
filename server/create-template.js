const { CodeSandbox } = require("@codesandbox/sdk");
require("dotenv").config(); // Assume dotenv is installed, or we just rely on env vars

async function createTemplate() {
  console.log("Initializing CodeSandbox SDK...");
  const sdk = new CodeSandbox();

  console.log("Creating new sandbox...");
  const sandbox = await sdk.sandboxes.create();

  console.log(`Sandbox created with ID: ${sandbox.id}`);
  console.log("Connecting to sandbox...");
  const client = await sandbox.connect();

  console.log("Installing dependencies (this may take a minute)...");
  // Install all the default dependencies used in SandboxIDE.tsx
  const deps = [
    "framer-motion",
    "motion-dom",
    "motion-utils",
    "@emotion/is-prop-valid",
    "lucide-react",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "react",
    "react-dom",
  ].join(" ");

  const output = await client.commands.run(`npm install ${deps}`, {
    onStdout: (data) => process.stdout.write(data),
    onStderr: (data) => process.stderr.write(data),
  });

  console.log("\nDependencies installed successfully.");

  console.log("Setting up tasks.json...");
  const tasksJson = {
    setupTasks: [
      {
        name: "Install Dependencies",
        command: "npm install",
      },
    ],
    tasks: {
      dev: {
        name: "Dev Server",
        command: "npm run dev",
        runAtStart: true,
      },
    },
  };

  await client.fs.writeFile(
    "/.codesandbox/tasks.json",
    JSON.stringify(tasksJson, null, 2),
  );
  console.log("tasks.json created.");

  console.log("Closing connection...");
  client.dispose();

  console.log("Hibernating sandbox to save as a template snapshot...");
  await sdk.sandboxes.hibernate(sandbox.id);

  console.log("\n============== SUCCESS ==============\n");
  console.log(`Your new CSB_TEMPLATE_ID is: ${sandbox.id}`);
  console.log("Add this to your server's .env file:");
  console.log(`CSB_TEMPLATE_ID=${sandbox.id}`);
  console.log("\n=====================================\n");

  process.exit(0);
}

createTemplate().catch((err) => {
  console.error("Error creating template:", err);
  process.exit(1);
});
