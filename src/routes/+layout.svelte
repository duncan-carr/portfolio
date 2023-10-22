<script>
    import "../app.css";
</script>

<div class="sm:hidden flex items-center justify-center bg-red-500 p-1">
    <p class="bg-red-500 text-white p-1">
        Because you're viewing this website on a small device, it may not display all
        content in a readable manner. A responsive design has not yet been implemented.
    </p>
</div>

<nav class="m-10 justify-end flex gap-10">
    <a href="#about">About Me</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
</nav>

<slot />

<footer id="contact" class="my-10 flex w-full justify-center gap-10 items-center">
    <h3 class="text-lg font-thin">Contact Me — Email: dacarr@mail.bradley.edu — Phone: +1 (314) 375-2953</h3>
</footer>