<script>
    import main from '$lib/main.jpg';
</script>

<div class="flex items-center justify-center my-36 gap-10">
    <div>
        <img src={main} alt="" class="w-36 shadow-lg rounded-full">
    </div>

    <div id="intro" class="flex flex-col">
        <h1 class="text-4xl font-bold">Hi there! I'm Duncan. 👋</h1>
        <h3 class="text-xl text-gray-600">A computer science and photography hobbyist</h3>
    </div>
</div>

<div id="about" class="flex justify-around items-center m-16 gap-20">
    <div class="p-5 w-2/3">
        <h2 class="font-bold text-2xl mb-2">About Me</h2>
        <p>
            My name is Duncan Carr. I'm a freshman Mathematics major at Bradley University.
            In my spare time, I enjoy spending time with friends, collaborating on side-projects,
            and trying new things.

            <br/>
            <br/>

            Recently, I've become more and more interested in photography and graphic design. This past
            year, I received <a href="https://www.usa.canon.com/support/p/eos-m5">a camera (Canon EOS M5)</a> and I have
            since started trying to figure out how to take pictures by photographing friends and
            nature. My interest in graphic design manifested by my creation and management of a
            post-high-school-graduation <a href="https://www.instagram.com/sluh.2023/">Instagram account (@sluh.2023)</a>,
            where I showcased students' post grad plans. I learned how to use Adobe Illustrator to create
            graphics and learned strategies for different layouts.
        </p>
    </div>
</div>

<div id="projects" class="flex justify-around items-center mx-16 gap-20">
    <div class="p-5 w-2/3">
        <h2 class="font-bold text-2xl mb-2">Past Projects</h2>
        <div class="my-3">
            <h3 class="text-lg font-thin">This Website – Oct 2023 – <i class="fa-brands fa-github"></i> <a target="_blank" href="https://github.com/duncan-carr/portfolio">Source Code</a></h3>
            <p>
                I created this website from scratch using <a href="https://kit.svelte.dev/">SvelteKit</a>
                and <a href="https://tailwindcss.com/">TailwindCSS</a>. This website showcases my website
                design skills and my previous work in other areas of interest (photography & graphic design).
            </p>
        </div>
        <div class="my-3">
            <h3 class="text-lg font-thin">Laundry Website – Sep 2023 – <i class="fa-brands fa-github"></i> <a target="_blank" href="https://github.com/mcurranseijo/BravesLaundry">Source Code</a> – <a target="_blank" href="https://braveslaundry.kbots.tech/">Website Link</a></h3>
            <p>
                In collaboration with another Bradley student, I help to create a website that displays laundry information
                of all the different locations around campus. This website utilizes vanilla HTML, JS, and CSS.
            </p>
        </div>
        <div class="my-3">
            <h3 class="text-lg font-thin">Photos of a Friend – Aug 2023 – <i class="fa-brands fa-square-behance"></i> <a target="_blank" href="https://www.behance.net/gallery/178620335/Mitchell-Photos">Behance</a></h3>
            <p>
                I took pictures of a friend with my camera, playing around with custom camera settings to try
                and get good shots. Additionally, I utilized Adobe Lightroom to edit the photos.
            </p>
        </div>
        <div class="my-3">
            <h3 class="text-lg font-thin">Post-Grad Instagram Account – Apr 2023 through June 2023 – <i class="fa-brands fa-square-instagram"></i> <a target="_blank" href="https://www.instagram.com/sluh.2023/https://www.instagram.com/sluh.2023/">Instagram Account</a></h3>
            <p>
                Handled surveying information from students and used Adobe Illustrator to create each post's graphic. I learned
                more about spacing and graphic design principles, and became familiar with Illustrator's tools.
            </p>
        </div>
        <div class="my-3">
            <h3 class="text-lg font-thin">Compiled Photos – Ongoing – <i class="fa-brands fa-square-behance"></i> <a target="_blank" href="https://www.behance.net/gallery/182866945/Random-Pictures">Behance</a></h3>
            <p>
                This Behance project contains random pictures taken with my camera after I got it. I learned more about how
                to frame shots and use my camera's tools to get better pictures.
            </p>
        </div>
    </div>
</div>