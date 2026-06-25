#!/usr/bin/env python3
"""Generate specialists pages from doctors template."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE_TEMPLATE = ROOT / "about" / "index.html"

ABOUT_DESCRIPTION = '<meta name="description" content="О стоматологической клинике Estetic Smile в Тайге: команда, подход к лечению, опыт и ценности.">'
ABOUT_TITLE = "<title>О клинике Estetic Smile</title>"

BTN_SVG = """<svg class="btn-tablet-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect class="btn-tablet-icon__case" x="5" y="3" width="14" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
                  <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--1" x="8" y="8" width="8" height="1.6" rx="0.8" fill="currentColor"/>
                  <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--2" x="8" y="11.2" width="8" height="1.6" rx="0.8" fill="currentColor"/>
                  <rect class="btn-tablet-icon__bar btn-tablet-icon__bar--3" x="8" y="14.4" width="6" height="1.6" rx="0.8" fill="currentColor"/>
                </svg>"""

DOCTORS = [
    {
        "slug": "archakova",
        "name": "Арчакова Елена Сергеевна",
        "badge": "Главный врач",
        "roles": "врач-стоматолог-ортопед, терапевт, хирург",
        "img_alt": "Арчакова Елена Сергеевна — главный врач Estetic Smile",
        "bio": """
                <p>Закончила Кемеровскую Государственную Медицинскую Академию в 2013 году по специальности «Врач», а в 2014&nbsp;году — интернатуру по специальности «Стоматология общей практики». Дипломы профессиональной переподготовки по стоматологии детской, хирургической, ортопедической и организации здравоохранения и общественного здоровья.</p>
                <p>Специализируюсь на <strong>эстетической и функциональной реабилитации улыбки</strong> с использованием <strong>виниров, цельнокерамических коронок</strong> и современных методов протезирования.</p>
                <p>Провожу <strong>комплексное восстановление зубов любой сложности</strong>, помогая пациентам обрести красивую, естественную улыбку, восстановить жевательную функцию и уверенность в себе. В работе уделяю особое внимание деталям, гармонии лица и долговечности результата.</p>
                <p>Для каждого пациента разрабатываю <strong>индивидуальный план лечения</strong>, ориентируясь на высокие стандарты эстетики, комфорта и качества.</p>
                <p class="doctor-card__note">Участник многочисленных конференций, конгрессов и семинаров.</p>""",
    },
    {
        "slug": "zhuikov",
        "name": "Жуйков Александр Андреевич",
        "badge": "Челюстно-лицевой хирург",
        "roles": "хирургическая стоматология, имплантология",
        "img_alt": "Жуйков Александр Андреевич — челюстно-лицевой хирург Estetic Smile",
        "bio": """
                <p>В 2016–2021 годах обучался в Кемеровском государственном медицинском университете на стоматологическом факультете. После окончания университета продолжил профессиональное развитие и с 2021 по 2023 год проходил ординатуру по специальности «Челюстно-лицевая хирургия».</p>
                <p>В своей практике Александр Андреевич уделяет особое внимание <strong>современным методам лечения, безопасности пациентов и качественному результату</strong>. Регулярно проходит курсы повышения квалификации, участвует в профессиональных семинарах и обучающих программах, что позволяет применять в работе <strong>актуальные технологии и методики современной стоматологии</strong>.</p>
                <p class="doctor-card__note">Постоянное развитие и стремление к профессиональному росту помогают оказывать пациентам высококвалифицированную помощь и добиваться стабильных клинических результатов.</p>""",
    },
    {
        "slug": "zaitseva",
        "name": "Зайцева Елена Николаевна",
        "badge": "Стоматолог-терапевт-хирург",
        "roles": "стоматолог-терапевт-хирург",
        "img_alt": "Зайцева Елена Николаевна — стоматолог-терапевт-хирург Estetic Smile",
        "bio": """
                <p>Закончила Кемеровскую Государственную Медицинскую Академию в 1995&nbsp;г. по специальности «стоматология». В 1996&nbsp;г. закончила интернатуру в Красноярской Медицинской академии по специальности «стоматолог – терапевт».</p>
                <p>Специализируется на <strong>диагностике, профилактике и лечении заболеваний твёрдых тканей зубов и тканей пародонта</strong>. Владеет современными методиками лечения кариеса и его осложнений, <strong>эндодонтического лечения корневых каналов</strong> с применением оптического увеличения и современных протоколов обработки.</p>
                <p>Основным направлением профессиональной деятельности является <strong>эстетическая и функциональная реставрация зубов</strong> с использованием высококачественных композитных материалов. Выполняет прямые художественные реставрации фронтальной и жевательной групп зубов, восстановление анатомической формы, цвета и естественной эстетики зубного ряда с учётом индивидуальных особенностей пациента.</p>
                <p>Проводит <strong>комплексную профилактику стоматологических заболеваний</strong>, включая профессиональную гигиену полости рта, реминерализующую терапию, фторирование, обучение индивидуальной гигиене и разработку персонализированных программ профилактики. Особое внимание уделяет сохранению собственных тканей зуба, <strong>минимально инвазивным методикам лечения</strong> и достижению долгосрочного клинического результата.</p>
                <p class="doctor-card__note">Участник многочисленных конференций и семинаров.</p>""",
    },
    {
        "slug": "zabolotnaya",
        "name": "Заболотная Кристина Евгеньевна",
        "badge": "Врач-стоматолог-терапевт",
        "roles": "врач-стоматолог общей практики",
        "img_alt": "Заболотная Кристина Евгеньевна — врач-стоматолог-терапевт Estetic Smile",
        "bio": """
                <p>Закончила Кемеровский Государственный Медицинский Институт в 2023&nbsp;г. по специальности «Стоматология».</p>
                <p>Врач-стоматолог-терапевт с углублённой специализацией в области <strong>современной реставрационной стоматологии, эстетической реабилитации и профилактики стоматологических заболеваний</strong>. Проводит комплексную диагностику, лечение и восстановление зубов с применением современных клинических протоколов, цифровых технологий и принципов минимально инвазивной стоматологии.</p>
                <p>Специализируется на <strong>лечении кариеса и его осложнений, эндодонтическом лечении корневых каналов</strong> различной степени сложности, а также на эстетической и функциональной реставрации зубов с использованием высокоэстетичных композиционных материалов последнего поколения. Выполняет художественные реставрации с детальным воспроизведением естественной анатомии, морфологии, оптических свойств и индивидуальных характеристик зубов, обеспечивая гармоничную интеграцию реставраций в зубной ряд.</p>
                <p>Владеет современными методиками <strong>адгезивной стоматологии</strong>, позволяющими максимально сохранять здоровые ткани зуба и добиваться прогнозируемых долгосрочных результатов. При планировании лечения учитывает не только локальные клинические задачи, но и функциональные особенности зубочелюстной системы, окклюзионные взаимоотношения и эстетические параметры улыбки.</p>
                <p class="doctor-card__note">Участник многочисленных конференций и семинаров.</p>""",
    },
    {
        "slug": "ledovskaya",
        "name": "Ледовская Ольга Валентиновна",
        "badge": "Врач-стоматолог-терапевт",
        "roles": "врач-стоматолог общей практики",
        "img_alt": "Ледовская Ольга Валентиновна — врач-стоматолог-терапевт Estetic Smile",
        "bio": """
                <p>В 2021 году окончила Кемеровский государственный медицинский университет по специальности «Стоматология» и являюсь врачом-стоматологом общей практики. С 2024 года по настоящее время работаю врачом-стоматологом-терапевтом в клинике Estetic Smile. В 2022–2025 годах параллельно обучалась в Кемеровском медицинском колледже по специальности «Зубной техник».</p>
                <p>Основными направлениями моей деятельности являются <strong>терапевтическое лечение кариеса и его осложнений</strong>, а также <strong>профилактические мероприятия</strong>, направленные на предотвращение развития кариеса и других заболеваний полости рта. Обладаю навыками работы с современными пломбировочными материалами и технологиями.</p>
                <p>Участвовала в семинаре «Эндодонтическое лечение и реставрация боковой группы зубов» (лектор Дмитрий Николаев, 2021), курсе «Эндодонтическое перелечивание. Методика безопасного извлечения фрагментов сломанных инструментов из корневых каналов» (лектор Землякова Ольга, 2022), а также «Endo. Повседневная практика Lite» (лектор Юрий Кочаров, 2025).</p>
                <p class="doctor-card__note">Имею отличные коммуникативные навыки, что позволяет легко устанавливать контакт с пациентами и подробно объяснять ход лечения. Являюсь ответственным, внимательным к деталям специалистом.</p>""",
    },
]


def patch_nav(html: str, depth: str) -> str:
    """depth: '' for root-level paths like ../, '../../' for nested."""
    prefix = depth
    html = html.replace('href="../doctors/"', f'href="{prefix}specialists/#doctors"')
    html = html.replace('href="../doctors/" aria-current="page"', f'href="{prefix}specialists/#doctors"')
    html = html.replace('href="../assistants/"', f'href="{prefix}specialists/#assistants"')
    html = html.replace('href="../assistants/" aria-current="page"', f'href="{prefix}specialists/#assistants"')
    html = html.replace('href="doctors/"', f'href="{prefix}specialists/#doctors"')
    html = html.replace('href="assistants/"', f'href="{prefix}specialists/#assistants"')
    return html


def patch_specialists_current(html: str, depth: str) -> str:
    """Move aria-current from «О нас» to «Специалисты» (template is about/)."""
    prefix = depth
    specialists_href = f"{prefix}specialists/"
    about_href = f"{prefix}about/"
    html = html.replace(
        f'<li><a href="{specialists_href}">Специалисты</a></li>',
        f'<li><a href="{specialists_href}" aria-current="page">Специалисты</a></li>',
    )
    html = html.replace(
        f'<li><a href="{about_href}" aria-current="page">О нас</a></li>',
        f'<li><a href="{about_href}">О нас</a></li>',
    )
    return html


def preview_card(doctor: dict) -> str:
    return f"""
          <a class="specialist-preview-card" href="{doctor['slug']}/">
            <div class="specialist-preview-card__media">
              <img src="../images/doctors/{doctor['slug']}.jpg" alt="{doctor['name']}" width="480" height="640" loading="lazy">
            </div>
            <div class="specialist-preview-card__overlay">
              <div class="specialist-preview-card__info">
                <p class="specialist-preview-card__roles">{doctor['roles']}</p>
                <h3 class="specialist-preview-card__name">{doctor['name']}</h3>
              </div>
              <span class="specialist-preview-card__cta">
                Записаться на приём
                {BTN_SVG}
              </span>
            </div>
          </a>"""


def specialists_main() -> str:
    template = PAGE_TEMPLATE.read_text(encoding="utf-8")
    start = template.index("<main>")
    end = template.index("</main>") + len("</main>")
    head = patch_specialists_current(patch_nav(template[:start], "../"), "../")
    foot = patch_specialists_current(patch_nav(template[end:], "../"), "../")

    cards = "\n".join(preview_card(d) for d in DOCTORS)

    main = f"""<main>
    <section class="inner-hero" aria-labelledby="page-title">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Хлебные крошки">
          <ol class="breadcrumbs__list">
            <li><a href="../">Главная</a></li>
            <li aria-current="page">Специалисты</li>
          </ol>
        </nav>

        <div class="inner-hero__content">
          <h1 id="page-title">Специалисты</h1>
          <p>Врачи и ассистенты клиники Estetic Smile.</p>
        </div>
      </div>
    </section>

    <nav class="specialists-nav" aria-label="Разделы специалистов">
      <div class="container">
        <ul class="specialists-nav__list">
          <li><a class="specialists-nav__link is-active" href="#doctors" aria-current="true">Врачи</a></li>
          <li><a class="specialists-nav__link" href="#assistants">Ассистенты</a></li>
        </ul>
      </div>
    </nav>

    <section id="doctors" class="page-section specialists-section" aria-labelledby="doctors-team-title">
      <div class="container">
        <div class="page-section__header">
          <h2 id="doctors-team-title">Врачи</h2>
          <p>Квалифицированные врачи с многолетним опытом и вниманием к деталям.</p>
        </div>

        <div class="specialists-preview-grid">
{cards}
        </div>
      </div>
    </section>

    <section id="assistants" class="page-section specialists-section specialists-section--alt" aria-labelledby="assistants-team-title">
      <div class="container">
        <div class="page-section__header">
          <h2 id="assistants-team-title">Ассистенты</h2>
          <p class="specialists-empty">Информация об ассистентах появится в ближайшее время.</p>
        </div>
      </div>
    </section>
  </main>"""

    head = head.replace(
        ABOUT_DESCRIPTION,
        '<meta name="description" content="Специалисты стоматологической клиники Estetic Smile в Тайге: врачи и ассистенты.">',
    ).replace(ABOUT_TITLE, "<title>Специалисты — Estetic Smile</title>")

    foot = foot.replace(
        '<script defer src="../js/maps.js"></script>',
        '<script defer src="../js/maps.js"></script>\n  <script defer src="../js/specialists.js"></script>',
    )

    return head + main + foot


def doctor_detail(doctor: dict) -> str:
    template = PAGE_TEMPLATE.read_text(encoding="utf-8")
    start = template.index("<main>")
    end = template.index("</main>") + len("</main>")
    head = template[:start].replace("../", "../../")
    foot = template[end:].replace("../", "../../")
    head = patch_specialists_current(patch_nav(head, "../../"), "../../")
    foot = patch_specialists_current(patch_nav(foot, "../../"), "../../")

    main = f"""<main>
    <section class="inner-hero inner-hero--profile" aria-labelledby="page-title">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Хлебные крошки">
          <ol class="breadcrumbs__list">
            <li><a href="../../">Главная</a></li>
            <li><a href="../#doctors">Специалисты</a></li>
            <li aria-current="page">{doctor['name']}</li>
          </ol>
        </nav>

        <div class="inner-hero__content">
          <h1 id="page-title">{doctor['name']}</h1>
        </div>
      </div>
    </section>

    <section class="page-section doctor-detail" aria-labelledby="doctor-profile-title">
      <div class="container">
        <article class="doctor-card">
          <div class="doctor-card__media">
            <img src="../../images/doctors/{doctor['slug']}.jpg" alt="{doctor['img_alt']}" width="480" height="600" loading="lazy">
          </div>
          <div class="doctor-card__content">
            <span class="doctor-card__badge">{doctor['badge']}</span>
            <h2 id="doctor-profile-title" class="doctor-card__name">{doctor['name']}</h2>
            <p class="doctor-card__roles">{doctor['roles']}</p>

            <div class="doctor-card__bio">
{doctor['bio']}
            </div>

            <a class="btn btn-primary doctor-card__cta" href="#" data-open-booking>
              Записаться на приём
              {BTN_SVG}
            </a>
          </div>
        </article>
      </div>
    </section>
  </main>"""

    head = head.replace(
        ABOUT_DESCRIPTION,
        f'<meta name="description" content="{doctor["name"]} — врач клиники Estetic Smile в Тайге.">',
    ).replace(ABOUT_TITLE, f"<title>{doctor['name']} — Estetic Smile</title>")

    return head + main + foot


def redirect_page(target: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url={target}">
  <link rel="canonical" href="{target}">
  <script>location.replace("{target}");</script>
  <title>Перенаправление…</title>
</head>
<body>
  <p><a href="{target}">Перейти на страницу специалистов</a></p>
</body>
</html>
"""


def update_all_html_nav() -> None:
    replacements = [
        ('href="../doctors/" aria-current="page"', 'href="../specialists/#doctors"'),
        ('href="../doctors/"', 'href="../specialists/#doctors"'),
        ('href="../assistants/" aria-current="page"', 'href="../specialists/#assistants"'),
        ('href="../assistants/"', 'href="../specialists/#assistants"'),
        ('href="doctors/"', 'href="specialists/#doctors"'),
        ('href="assistants/"', 'href="specialists/#assistants"'),
    ]
    for path in ROOT.rglob("index.html"):
        if "specialists" in path.parts and path.parent.name != "specialists":
            continue
        text = path.read_text(encoding="utf-8")
        original = text
        for old, new in replacements:
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"updated nav: {path.relative_to(ROOT)}")


def main() -> None:
    specialists_dir = ROOT / "specialists"
    specialists_dir.mkdir(exist_ok=True)
    (specialists_dir / "index.html").write_text(specialists_main(), encoding="utf-8")
    print("wrote specialists/index.html")

    for doctor in DOCTORS:
        out = specialists_dir / doctor["slug"] / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(doctor_detail(doctor), encoding="utf-8")
        print(f"wrote specialists/{doctor['slug']}/index.html")

    (ROOT / "doctors" / "index.html").write_text(redirect_page("../specialists/#doctors"), encoding="utf-8")
    (ROOT / "assistants" / "index.html").write_text(redirect_page("../specialists/#assistants"), encoding="utf-8")
    print("wrote redirects for doctors/ and assistants/")

    update_all_html_nav()

    subprocess.run([sys.executable, str(ROOT / "scripts" / "patch-header-a11y.py")], check=True)


if __name__ == "__main__":
    main()
