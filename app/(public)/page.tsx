import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroSlideshow, type HeroSlide } from "@/components/home/hero-slideshow";
import { ProjectCard } from "@/components/projects/project-card";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Reveal } from "@/components/ui/reveal";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getPublicStorageUrl } from "@/lib/utils/storage";
import { pairServices, splitLines } from "@/lib/content";

export default async function HomePage() {
  const [settings, featuredProjects] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(8),
  ]);

  const projectSlides: HeroSlide[] = featuredProjects
    .filter((p) => p.cover_image_path)
    .slice(0, 5)
    .map((p) => ({
      src: getPublicStorageUrl("project-images", p.cover_image_path),
      alt: p.title,
      href: `/projects/${p.slug}`,
      label: p.title,
    }));
  const slides: HeroSlide[] =
    projectSlides.length > 0
      ? projectSlides
      : [{ src: "/placeholders/project.svg", alt: settings.companyName }];

  const [heroTitle, ...heroSub] = splitLines(settings.heroTitle);
  const [aboutKo, ...aboutEn] = splitLines(settings.aboutText);
  const services = pairServices(settings.services);

  return (
    <>
      <section className="relative flex h-[100svh] min-h-[600px] items-center text-white">
        <HeroSlideshow slides={slides} />
        <div className="container-site relative z-10">
          <p className="eyebrow text-white/90 drop-shadow-sm">{settings.heroSubtitle}</p>
          <h1 className="mt-6 max-w-5xl text-[2.6rem] leading-[1.12] md:text-7xl lg:text-[5.5rem]">
            {heroTitle}
          </h1>
          {heroSub.length > 0 && (
            <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">{heroSub.join(" ")}</p>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-ink transition-colors hover:bg-white/85"
            >
              프로젝트 보기
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-medium backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
            >
              상담 문의
              <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-site grid gap-12 py-24 md:grid-cols-12 md:py-36">
        <Reveal className="md:col-span-3">
          <p className="eyebrow">About MIGANG</p>
        </Reveal>
        <Reveal className="md:col-span-9" delay={100}>
          <p className="text-2xl leading-snug font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.3]">
            {aboutKo}
          </p>
          {aboutEn.length > 0 && (
            <p className="mt-6 text-lg text-muted md:text-xl">{aboutEn.join(" ")}</p>
          )}
          {services.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2">
              {services.map((service) => (
                <li
                  key={service.ko}
                  className="rounded-full border border-border px-4 py-2 text-sm"
                >
                  {service.ko}
                  {service.en && <span className="ml-2 text-muted">{service.en}</span>}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/about"
            className="group mt-12 inline-flex items-center gap-2 text-sm font-medium"
          >
            회사 소개 보기
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </Reveal>
      </section>

      {featuredProjects.length > 0 && (
        <section className="container-site pb-24 md:pb-36">
          <Reveal className="mb-12 flex items-end justify-between gap-6 border-t border-border pt-10 md:mb-16">
            <div>
              <p className="eyebrow">Selected Projects</p>
              <h2 className="mt-4 text-3xl md:text-5xl">주요 시공 사례</h2>
            </div>
            <Link
              href="/projects"
              className="group hidden items-center gap-2 text-sm font-medium sm:inline-flex"
            >
              전체 프로젝트
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </Reveal>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 md:gap-y-20">
            {featuredProjects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 2) * 120}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          <div className="mt-16 text-center sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium"
            >
              전체 프로젝트 보기
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </section>
      )}

      <CtaBanner phone={settings.phone} />
    </>
  );
}
