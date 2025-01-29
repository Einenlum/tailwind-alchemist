<br/>
<div align="center">
<a href="https://github.com/einenlum/tailwind-alchemist">
<img src="images/logo.png" alt="Logo" width="80" height="80">
</a>
<h3 align="center">Tailwind Alchemist 🪄</h3>
<p align="center">
A CLI tool to manage and replace Tailwind CSS colors in your project.<br />Built for developers who want to keep their Tailwind color usage clean and consistent.
<br/>
<br/>
</p>
</div>

If you’ve ever wanted to:
- **Check all the Tailwind default colors** used in your project.
- **Replace existing colors** with new ones while maintaining consistency.

...then **Tailwind Alchemist** is for you 🪄

---

## Installation

No need to install it, you can run it with `npx`.

## Usage

All commands require at least one option `-p` or `--pattern` to know where to look for.

- Example with one pattern: `-p 'resources/views/**'`
- Example with multiple patterns: `-p 'resources/views/**' -p 'my/other/folder/**'`

### Scan for Tailwind Default Colors

To scan your project for Tailwind default colors:

```bash
npx tw-alchemist scan -p 'resources/views/**' -p 'some/other/folder/**'
```

Options:

- `-v`: Display the files where the colors are found.

```bash
npx tw-alchemist scan -p 'resources/views/**' -v
```

- `-vv`: Display the files and matches where the colors are found.

```bash
npx tw-alchemist scan -p 'resources/views/**' -vv
```

### Scan for a specific color (even a custom one)

```bash
npx tw-alchemist scan indigo-800 -p 'resources/views/**' -vv
```

### Replace Colors

To replace an existing color with another one:

```bash
npx tw-alchemist replace oldColor newColor -p 'resources/views/**'
```

To check what would be done without touching files, use `--dry-run`:

```bash
npx tw-alchemist replace oldColor newColor -p 'resources/views/**' --dry-run
```

Notes:

- If `newColor` doesn’t exist in your Tailwind config, the tool will print the necessary CSS for you to add.
- If `oldColor` is one of Tailwind’s default colors, the tool will use its **OKLCH value** for accurate replacement.


## Compatibility

Only compatible with TailwindCSS 4.x.

Should work more or less on TailwindCSS 3.x.

## Disclaimer

This tool is **not** affiliated with Tailwind CSS or its creators. It’s a personal project built to help developers manage their Tailwind CSS colors.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Author

Yann Rabiller ([@einenlum](https://github.com/Einenlum/)). You can check my [blog](https://www.einenlum.com) and my [book](https://www.einenlum.com/book) _From PHP to Python_.

## License

This project is licensed under the **MIT License**. See the [LICENSE](/license) file for details.
