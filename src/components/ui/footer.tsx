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
  menuItems?: MenuItem[];
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
  menuItems = [
    {
      title: "Site",
      links: [
        { text: "Home", url: "#" },
        { text: "Pesquisa", url: "#" },
        { text: "Sobre", url: "#" },
      ],
    },
  ],
  menuItems2 = [
    {
      title: "Desenvolvedores",
      links: [
        { text: "Aluno 1", url: "#" },
        { text: "Aluno 2", url: "#" },
        { text: "Aluno 3", url: "#" },
        { text: "...", url: "#" },
      ],
    },
  ],
  copyright = "© 2025 nome_do_site.com. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {
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
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-6 ">
            {menuItems2.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="font-medium hover:text-primary">
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="font-medium hover:text-primary">
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
