import React, { useEffect } from 'react';
import { PHOTOS, PHOTO_LICENSE } from '../data/photoGallery';
import { applyPageSeo } from '../utils/seo';
import { SITE } from '../data/siteConfig';
import { Camera, Download, Mail } from 'lucide-react';

/**
 * /press - the official photo library.
 *
 * Deliberately not linked from the navigation, the footer or any page body.
 * It exists for Google Images, Google News publishers and journalists who need a
 * portrait. Crawlers reach it through sitemap.xml, sitemap-images.xml and the
 * `image` array on the Person entity.
 *
 * The page is authored for machine readability first: every photo is a <figure>
 * with a real <img> (src, alt, width, height), a <figcaption> and a longer
 * description paragraph, so the text-to-image association is unambiguous.
 */
export const PressKitPage: React.FC = () => {
  useEffect(() => {
    applyPageSeo('/press');
  }, []);

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <header className="space-y-5 pb-10 border-b border-[#1E273A]">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#38BDF8]">
            <Camera className="w-4 h-4" />
            Press &amp; Media Library
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Tanaka Gaadzikwa Photos &amp; Press Kit
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-[#94A3B8]">
            The official photo library of <strong className="text-white">Tanaka Gaadzikwa</strong> —
            young entrepreneur, software builder, founder and CEO of LINKUP, known as the
            {' '}<em className="text-[#38BDF8] not-italic">Startup Cupid</em> and
            {' '}<em className="text-[#38BDF8] not-italic">The Minister of AI</em> — photographed in
            Harare and rural Zimbabwe. {PHOTOS.length} high-resolution portraits and press graphics,
            free to publish with a credit.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#64748B]">
            <span>{PHOTOS.length} photos</span>
            <span aria-hidden="true">·</span>
            <span>JPEG, up to 1280px tall</span>
            <span aria-hidden="true">·</span>
            <span>Updated {PHOTOS[0]?.datePublished}</span>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${SITE.email}`} className="text-[#38BDF8] hover:underline inline-flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Request a specific shot
            </a>
          </div>
        </header>

        <section aria-labelledby="library-heading" className="pt-10">
          <h2 id="library-heading" className="sr-only">
            Every photo of Tanaka Gaadzikwa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHOTOS.map((photo, index) => (
              <figure
                key={photo.id}
                id={photo.id}
                className="group flex flex-col rounded-2xl border border-[#1E273A] bg-[#0F1729] overflow-hidden"
                itemScope
                itemType="https://schema.org/ImageObject"
              >
                <div className="relative overflow-hidden bg-[#0B1120]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    itemProp="contentUrl"
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <a
                    href={photo.src}
                    download={photo.file}
                    className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    aria-label={`Download ${photo.title}`}
                  >
                    <Download className="w-3 h-3" /> JPG
                  </a>
                </div>

                <figcaption className="flex flex-col gap-2 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">
                    {photo.category} · {photo.width}×{photo.height}
                  </p>
                  <h3 itemProp="name" className="text-sm font-bold leading-snug text-white">
                    {photo.title}
                  </h3>
                  <p itemProp="caption" className="text-[13px] leading-relaxed text-[#94A3B8]">
                    {photo.caption}
                  </p>
                  <p
                    itemProp="description"
                    className="text-[12px] leading-relaxed text-[#64748B] border-t border-[#1E273A] pt-2 mt-1"
                  >
                    {photo.description}
                  </p>
                  <p className="text-[11px] text-[#475569]">
                    <meta itemProp="creditText" content={photo.creditText} />
                    <meta itemProp="datePublished" content={photo.datePublished} />
                    Credit: {photo.creditText}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4 rounded-2xl border border-[#1E273A] bg-[#0F1729] p-6">
          <h2 className="text-lg font-bold text-white">Using these photos of Tanaka Gaadzikwa</h2>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            Every image on this page is an official photograph of Tanaka Gaadzikwa, released for
            editorial and press use. Credit “Tanaka Gaadzikwa” and, where the shot is watermarked,
            “Photography by TAKEPHOTOS”. They may not be used to advertise a product, imply an
            endorsement, or be edited in a way that changes their meaning.
          </p>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            Full licence terms:{' '}
            <a href={PHOTO_LICENSE.url} className="text-[#38BDF8] hover:underline">
              {PHOTO_LICENSE.name}
            </a>
            . For higher-resolution originals or an interview, email{' '}
            <a href={`mailto:${SITE.email}`} className="text-[#38BDF8] hover:underline">
              {SITE.email}
            </a>
            .
          </p>
        </section>

        <footer className="mt-10 border-t border-[#1E273A] pt-6">
          <p className="text-sm text-[#64748B]">
            More about Tanaka Gaadzikwa:{' '}
            <a href="/about" className="text-[#38BDF8] hover:underline">full biography</a> ·{' '}
            <a href="/projects" className="text-[#38BDF8] hover:underline">LINKUP and projects</a> ·{' '}
            <a href="/blogs" className="text-[#38BDF8] hover:underline">stories and essays</a> ·{' '}
            <a href="/contact" className="text-[#38BDF8] hover:underline">press enquiries</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PressKitPage;
