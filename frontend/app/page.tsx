"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLenis } from "@studio-freight/react-lenis";
import { AnimatedHeader } from "./components/landing/AnimatedHeader";
import { AnimatedSection } from "./components/landing/AnimatedSection";
import { BackgroundGrid } from "./components/landing/BackgroundGrid";
import { GridLines } from "./components/landing/GridLines";
import { StarField } from "./components/landing/StarField";
import { StrictCard } from "./components/landing/StrictCard";
import { StepsSection } from "./components/landing/StepsSection";
import { smoothScrollTo } from "./utils/landing/scroll";
import { aboutData, featuresData, editorFeaturesData, examplesData, projectInfo, teamMembers, repositories } from "./data/landingData";
import {
  sectionTitleAnimation,
  getCardAnimation,
  getCardAnimationSmall,
  buttonHoverAnimation,
  getFadeInAnimation,
  getFadeInAnimationSmall,
} from "./utils/landing/animations";

export default function Home() {
  const lenis = useLenis();

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden max-w-full">
      <AnimatedHeader />

      {/* Главная секция */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 overflow-hidden">
        <BackgroundGrid className="z-0" size={60} />
        <GridLines className="z-0" bottomOnly={true} />
        <StarField className="z-0" starCount={120} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 text-white px-2"
            {...getFadeInAnimation(0)}
          >
            Nimble — конструктор сайтов
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/80">
              без кода и ограничений
            </span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2"
            {...getFadeInAnimation(0.2)}
          >
            Создавайте профессиональные сайты визуально с помощью мощного редактора.
            Готовые шаблоны, настройка Header/Footer, управление проектами и публикация в один клик.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-2"
            {...getFadeInAnimationSmall(0.3)}
          >
            <motion.div {...buttonHoverAnimation}>
              <Link
                href="/editor"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-lg font-semibold text-base md:text-lg hover:bg-white/90 transition-all duration-300 text-center block"
              >
                Перейти в редактор
              </Link>
            </motion.div>
            <motion.div {...buttonHoverAnimation}>
              <Link
                href="#steps"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white rounded-lg font-semibold text-base md:text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-center block"
              >
                Узнать больше
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Компактная информация о проекте */}
      <section className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 bg-[#080808] border-y border-white/5 relative overflow-hidden">
        <BackgroundGrid className="z-0" size={40} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
            {/* Информация о проекте */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-sm text-white/60 mb-3">{projectInfo.description}</p>
              <div className="flex flex-wrap gap-2">
                {projectInfo.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Команда и репозиторий */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Команда */}
              <div>
                <span className="text-xs text-white/40 uppercase tracking-wider block mb-2">Команда</span>
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((member, index) => (
                    <a
                      key={index}
                      href={member.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
                      title={member.name}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13"/>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                      {member.name.split(' ')[0]}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Репозиторий */}
              <div>
                <span className="text-xs text-white/40 uppercase tracking-wider block mb-2">Репозиторий</span>
                <div className="flex gap-2">
                  {repositories.map((repo, index) => (
                    <a
                      key={index}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
                      title={repo.name}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      {repo.name}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Секция "О проекте" */}
      <AnimatedSection className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden relative" id="about">
        <BackgroundGrid className="z-0" size={60} />
        <GridLines className="z-0" />
        <StarField className="z-0" starCount={50} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-white"
            {...sectionTitleAnimation}
          >
            Возможности Nimble
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.map((item, index) => (
              <motion.div
                key={index}
                {...getCardAnimation(index)}
              >
                <StrictCard className="h-full">
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                </StrictCard>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Секция "Как это работает" */}
      <StepsSection />

      {/* Секция "Преимущества" */}
      <AnimatedSection className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden relative" id="features">
        <BackgroundGrid className="z-0" size={60} />
        <GridLines className="z-0" />
        <StarField className="z-0" starCount={50} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-16 text-white"
            {...sectionTitleAnimation}
          >
            Преимущества
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {featuresData.map((item, index) => (
              <motion.div
                key={index}
                {...getCardAnimation(index)}
              >
                <StrictCard className="h-full text-center">
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </StrictCard>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Секция "Возможности редактора" */}
      <AnimatedSection className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#080808] overflow-hidden relative">
        <BackgroundGrid className="z-0" size={40} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-16 text-white"
            {...sectionTitleAnimation}
          >
            Возможности редактора
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {editorFeaturesData.map((item, index) => (
              <motion.div
                key={index}
                {...getCardAnimationSmall(index)}
              >
                <StrictCard className="group cursor-pointer h-full">
                  <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </StrictCard>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Секция "Примеры использования" */}
      <AnimatedSection className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden relative" id="examples">
        <BackgroundGrid className="z-0" size={60} />
        <GridLines className="z-0" />
        <StarField className="z-0" starCount={50} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-16 text-white"
            {...sectionTitleAnimation}
          >
            Примеры использования
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {examplesData.map((item, index) => (
              <motion.div
                key={index}
                {...getCardAnimation(index)}
              >
                <StrictCard className="h-full">
                  <div className="aspect-video bg-white/5 rounded-lg mb-4 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-white/60 text-sm mb-3">{item.desc}</p>
                  <p className="text-white/70 text-sm">{item.details}</p>
                </StrictCard>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Секция "Призыв к действию" */}
      <AnimatedSection className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#080808] overflow-hidden relative">
        <BackgroundGrid className="z-0" size={40} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-white"
            {...sectionTitleAnimation}
          >
            Готовы создать свой сайт?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-white/70 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            Начните создавать профессиональные сайты с Nimble прямо сейчас. Визуальный редактор, готовые шаблоны, управление проектами — всё в одном месте.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            {...buttonHoverAnimation}
          >
            <Link
              href="/editor"
              className="inline-block px-8 md:px-12 py-4 md:py-5 bg-white text-black rounded-lg font-bold text-lg md:text-xl hover:bg-white/90 transition-all duration-300"
            >
              Перейти в конструктор
            </Link>
          </motion.div>
          <motion.p
            className="text-sm text-white/50 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            Пробно •  Без ограничений
          </motion.p>
        </div>
      </AnimatedSection>

      {/* Подвал сайта */}
      <footer className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-8 mb-6">
            <div className="flex items-center gap-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4L32 12V28L20 36L8 28V12L20 4Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M14 20L20 14L26 20L20 26L14 20Z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
              <span className="text-white font-semibold text-lg">Nimble</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <button
                onClick={() => smoothScrollTo("features", lenis)}
                className="text-white/50 hover:text-white text-xs md:text-sm transition-colors"
              >
                Возможности
              </button>
              <button
                onClick={() => smoothScrollTo("steps", lenis)}
                className="text-white/50 hover:text-white text-xs md:text-sm transition-colors"
              >
                Как это работает
              </button>
              <button
                onClick={() => smoothScrollTo("examples", lenis)}
                className="text-white/50 hover:text-white text-xs md:text-sm transition-colors"
              >
                Примеры
              </button>
              <Link
                href="/editor"
                className="text-white/50 hover:text-white text-xs md:text-sm transition-colors"
              >
                Конструктор
              </Link>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/30 text-xs">
              © 2025 Nimble
            </p>

          </div>
        </div>
      </footer>
      </main>
  );
}
