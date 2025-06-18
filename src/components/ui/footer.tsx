'use client';

import Link from 'next/link';

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "blocks for shadcn/ui",
    title: "Shadcnblocks.com",
    url: "https://www.shadcnblocks.com",
  },
  tagline = "Components made easy.",
  // Translated copyright and updated for centering
  copyright = "© 2025 UEFS Cursos. Todos os direitos reservados.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {

  // Define the menu items separately for clarity and explicit ordering
  const orientadoraSection: MenuItem = {
    title: "Orientadora",
    links: [
      { text: "Pamela Cortez", url: "https://github.com/pamicortez" },
    ],
  };

  const desenvolvedoresSection: MenuItem = {
    title: "Desenvolvedores",
    links: [
      { text: "Alexsami Lopes", url: "https://github.com/alexsami-lopes" },
      { text: "Cláudia Inês Sales", url: "https://github.com/clsf" },
      { text: "Dermeval Neves", url: "https://github.com/Dermeval" },
      { text: "Filipe Carvalho", url: "https://github.com/ripe-glv" },
      { text: "Leticia Ribeiro", url: "https://github.com/leticiaribeiro7" },
      { text: "Luis Fernando do Rosario Cintra", url: "https://github.com/fernandocintra2871" },
      { text: "Nirvan Yang", url: "https://github.com/yxngnd" },
      { text: "Vanderleicio", url: "https://github.com/Vanderleicio" },
      { text: "Wagner Alexandre", url: "https://github.com/WagnerAlexandre" },
      { text: "Washington Oliveira Júnior", url: "https://github.com/wlfoj" },
    ],
  };

  return (
    <section className="w-full py-8 px-8 bg-white border-t ">
      <div className="max-w-full mx-auto px-0 ">
        <footer>
          <div className="flex items-center gap-2 lg:justify-start py-4">
            <Link href="https://www.uefs.br/">
              <img
                src="https://i.imgur.com/9vhXMZK.png"
                alt="Logo UEFS"
                title="Uefs"
                className="h-20"
              />
            </Link>
          </div>
          {/* Main content area for Orientadora and Desenvolvedores */}
          <div className="flex flex-col gap-8"> {/* This ensures vertical stacking of sections */}
            {/* Orientadora Section */}
            <div>
              <h3 className="mb-4 font-bold">{orientadoraSection.title}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
                {orientadoraSection.links.map((link, linkIdx) => (
                  <div key={linkIdx} className="font-medium hover:text-primary">
                    <Link href={link.url}>{link.text}</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Desenvolvedores Section */}
            <div>
              <h3 className="mb-4 font-bold">{desenvolvedoresSection.title}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
                {desenvolvedoresSection.links.map((link, linkIdx) => (
                  <div key={linkIdx} className="font-medium hover:text-primary">
                    <Link href={link.url}>{link.text}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col justify-between gap-4 pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center justify-center"> {/* Added justify-center for centering */}
            <p>{copyright}</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };