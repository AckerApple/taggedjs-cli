export function parseCommandLineArguments() {
  // Get the command line arguments (excluding the first two elements which are node and the script file)
  const args = process.argv.slice(2);

  // Initialize an empty settings object
  const settings: Record<string, string> = {}
  // Loop through the command line arguments and populate the settings object
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    // Check if the argument starts with '--' and has a corresponding value
    if (arg.startsWith('--') && i + 1 < args.length) {
      const key = arg.slice(2);
      const value = args[i + 1];

      // Add the key-value pair to the settings object
      settings[key] = value;

      // Skip the next element in the loop since it has already been used as a value
      i++;
    }
  }

  return settings;
}
