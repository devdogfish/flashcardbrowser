import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hashPassword } from "@better-auth/utils/password";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const LUIGI_ID = "seed-user-luigi";

const COURSE_COLLECTION_ID = "seed-collection-info2390";

const DECKS: Array<{
  id: string;
  ownerId: string;
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  coverImage: string;
}> = [
  {
    id: "cmo2dspkt000w04l1c7tfbcno",
    ownerId: LUIGI_ID,
    title: `What is Data Science`,
    description: `A university-level deck covering foundational concepts in data science: what data and information are, how data is measured and stored, the scientific method, statistical tools, and the interdisciplinary nature of data science — illustrated with real research examples.`,
    visibility: "PUBLIC",
    coverImage: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492546-h7rofi2nwta.jpeg",
  },
  {
    id: "cmo2dsqiv001s04l1inwgpgfl",
    ownerId: LUIGI_ID,
    title: `Social Network Analysis`,
    description: `A comprehensive deck covering core SNA concepts including nodes, links, clustering, random networks, small-world networks, scale-free networks, power law distributions, homophily, and real-world applications in ecology, medicine, and literature.`,
    visibility: "PUBLIC",
    coverImage: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398493796-00fw5ln18vc3c.jpeg",
  },
  {
    id: "cmo2dsrbz002n04l165d6su0x",
    ownerId: LUIGI_ID,
    title: `Web Search Engines`,
    description: `Covers the history and mechanics of Google's search engine, the PageRank algorithm, Google Trends, normalized data, and how search query data can be used to study societal and cultural phenomena — including the Michel et al. (2011) culturomics research.`,
    visibility: "PUBLIC",
    coverImage: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494904-2jwjma5qrv6.jpeg",
  },
  {
    id: "cmo2dss1w003j04l1v2l5f884",
    ownerId: LUIGI_ID,
    title: `Machine Learning & AI`,
    description: `A comprehensive deck covering machine learning fundamentals, supervised and unsupervised learning, model evaluation metrics, key algorithms (k-NN, Decision Trees), and the history and philosophy of AI via Alan Turing and the Turing Test.`,
    visibility: "PUBLIC",
    coverImage: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495940-yhbw77pzx0k.jpeg",
  },
  {
    id: "cmo2dssv5004f04l1b15iv48r",
    ownerId: LUIGI_ID,
    title: `Data Science Applications`,
    description: `Covers three landmark studies applying data science to social media: predicting depression from Facebook language, measuring diurnal and seasonal mood patterns from Twitter, and detecting deceptive hotel reviews using NLP classifiers.`,
    visibility: "PUBLIC",
    coverImage: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496899-wyt8vq8o78.jpeg",
  },
];

const CARDS = [
  {
    id: "cmo2dsplq000x04l1gh2sr3ap",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Information → Data → Knowledge: how?

Think about the transformation chain.`,
    answer: `Stimuli → Information → Data → Knowledge

Stimuli that have meaning for a receiver become information. When information is entered and stored in a computer (converted to binary), it becomes data. When data is packaged or used for understanding or doing something, it becomes knowledge. (Claude Shannon is credited as the father of information theory.)`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492884-2zpptvfjkyk.jpeg",
    position: 0,
  },
  {
    id: "cmo2dsplq000y04l1m3yn21te",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Where does the oil analogy break down?

Clive Humby (2006) said 'Data is the new oil.'`,
    answer: `Data is infinitely durable and reusable; oil is finite

The analogy is TRUE in that data powers transformative technology (AI, analytics) and is a valuable commodity. It is FALSE because oil is finite while data is effectively infinitely durable and reusable, and data has far more variety — it can represent words, pictures, sounds, facts, and measurements.`,
    imageUrl: null,
    position: 1,
  },
  {
    id: "cmo2dsplq000z04l1p0t1poxw",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `What is a bit?

Consider how computers represent all information.`,
    answer: `A bit (binary digit) is the answer to a yes-or-no question: 1 = yes, 0 = no

Computers represent all data — video, images, sounds, text — as binary values using just 1s and 0s. A bit is the smallest unit. Eight bits make one byte. One megabyte (10^6 bytes) written out by hand would produce a line of 1s and 0s more than 5 times taller than Mount Everest.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492891-gpmyfv4wyyr.jpeg",
    position: 2,
  },
  {
    id: "cmo2dsplq001004l1rhpmwr5x",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `What does 1 gigabyte hold?

Use two concrete examples to anchor your answer.`,
    answer: `1 gigabyte = 10^9 bytes; holds ~7 min of HD video or a full-length compressed film

One gigabyte (10^9 bytes) is also roughly equivalent to circumnavigating the globe (about 40,000 km) if written out in binary by hand. By comparison: 1 terabyte (10^12 bytes) written by hand would extend to Saturn and back 25 times; 1 petabyte (10^15 bytes) would reach Voyager 1 and back.`,
    imageUrl: null,
    position: 3,
  },
  {
    id: "cmo2dsplq001104l1xppr93i6",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Digital data: 1986 vs. today?

Consider the role of the World Wide Web.`,
    answer: `From 6% digital in 1986 to over 99% digital today

In 1986 only 6% of the world's stored information was digital. By 2000 it was 25%; by 2007 it was 93%; by 2013 less than 2% of stored information was non-digital. Key drivers included the World Wide Web (invented by Tim Berners-Lee in 1989, public August 1991) and smartphones. The average person's data footprint is nearly one terabyte — about 8 trillion yes-or-no questions.`,
    imageUrl: null,
    position: 4,
  },
  {
    id: "cmo2dsplq001204l1xab9whwc",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Descriptive vs. inferential statistics?

Both use sample data, but they do different things with it.`,
    answer: `Descriptive statistics characterize the collected data; inferential statistics generalize from a sample to a population

Descriptive statistics describe and summarize the data already collected (e.g., mean, median, mode, range, standard deviation). Inferential statistics use sample data to make inferences or draw conclusions about a broader population. Big Data challenges this distinction by sometimes providing the entire population rather than a sample.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492875-x355v7a15sg.jpeg",
    position: 5,
  },
  {
    id: "cmo2dsplr001304l1myw40w0w",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Mean, median, mode, range of {52,10,7,10,16,23,17}?

Apply each measure of central tendency.`,
    answer: `Mean = 19.3, Median = 16, Mode = 10, Range = 45

Sorted: 7, 10, 10, 16, 17, 23, 52. Mean = (7+10+10+16+17+23+52)/7 = 135/7 = 19.3. Median = the middle value (4th of 7) = 16. Mode = most frequent value = 10. Range = 52 − 7 = 45 (interval [7, 52]).`,
    imageUrl: null,
    position: 6,
  },
  {
    id: "cmo2dsplr001404l1x8z5ldov",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `When is a result statistically significant?

Think about what p-value represents and the role of alpha.`,
    answer: `When p ≤ alpha (e.g., 0.05), meaning less than 5% chance the result occurred by chance alone

The p-value is the probability of obtaining the expected results if chance alone is operating. If this probability is equal to or less than the critical probability level alpha (α) — commonly set at 5% — the results are said to be statistically significant. A smaller p-value indicates stronger evidence against chance.`,
    imageUrl: null,
    position: 7,
  },
  {
    id: "cmo2dsplr001504l1n9557hxy",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `What does a correlation coefficient measure?

Recall both dimensions the coefficient captures.`,
    answer: `A correlation coefficient measures the magnitude and direction of the relationship between two variables

Values range from −1 to +1. A value of 0 means no relationship. A positive value means both variables move in the same direction (e.g., more revision → higher exam scores). A negative value means they move in opposite directions (e.g., more flu jabs → fewer flu cases). The coefficient does NOT prove causation.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492907-ysfmqyzaha.jpeg",
    position: 8,
  },
  {
    id: "cmo2dsplr001604l1s74j241z",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Why is Pearson r misleading for non-linear data?

Anscombe's quartet is a classic demonstration.`,
    answer: `Pearson r assumes linearity; very different scatter patterns can produce the same r value (e.g., r = 0.816)

Anscombe's quartet shows four datasets with nearly identical Pearson r (≈ 0.816) but radically different visual patterns: a genuine linear relationship, a curved relationship, a near-perfect line with a different slope, and a vertical cluster with one outlier driving the correlation. This illustrates why visualizing data with a scatterplot is essential alongside numeric statistics.`,
    imageUrl: null,
    position: 9,
  },
  {
    id: "cmo2dsplr001704l1501om63z",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Inductive vs. deductive reasoning in science?

Each starts from a different point and moves in a different direction.`,
    answer: `Inductive: specific observations → general theory. Deductive: existing theory → testable hypotheses → confirmation.

Inductive reasoning starts with specific observations, finds patterns, forms a tentative hypothesis, and builds a theory. Deductive reasoning starts with an existing theory, derives hypotheses, then collects data through observation or experiment to confirm or refute the theory. Science uses both in an iterative, accumulative process.`,
    imageUrl: null,
    position: 10,
  },
  {
    id: "cmo2dsplr001804l16q5lg5ej",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Popper's test for a scientific claim?

Watch out for a common misconception about this term.`,
    answer: `Falsifiability (refutability): the logical possibility that a claim can be shown false by observation or experiment

Karl Popper (1902–1994) argued that falsifiability is the demarcation between science and non-science. Crucially, 'falsifiable' does NOT mean the claim is false — it means it CAN IN PRINCIPLE be tested and disproven. Reproducibility (the ability of others working independently to replicate the test) is a key related requirement.`,
    imageUrl: null,
    position: 11,
  },
  {
    id: "cmo2dsplr001904l1jynz7bqb",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `What is Occam's Razor?

This principle is also known as the law of succinctness.`,
    answer: `Occam's Razor: when competing hypotheses are equal, choose the one with fewest assumptions

Attributed to William of Ockham (c.1288–1348): 'Plurality must never be posited without necessity.' Einstein restated the scientific ideal as covering the greatest number of empirical facts from the smallest number of axioms. Complex solutions are harder to explain, difficult to reproduce, and less likely to be cited, making simplicity a practical and philosophical virtue.`,
    imageUrl: null,
    position: 12,
  },
  {
    id: "cmo2dsplr001a04l1xorkdebn",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Sections of a peer-reviewed article, in order?

A format credited in part to Hermann Ebbinghaus.`,
    answer: `Abstract, Introduction, Methods & Experiment, Results, Discussion, Acknowledgments, References

The Introduction provides context, the research problem, and a review of literature. Methods & Experiment describes how data were collected and analyzed. Results presents findings. Discussion interprets them. Research can also be disseminated as conference papers, posters, oral presentations, or technical reports — peer-reviewed journals and conferences are the primary channels.`,
    imageUrl: null,
    position: 13,
  },
  {
    id: "cmo2dsplr001b04l13eax94b6",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Three disciplines defining data science?

Think about the classic Venn diagram representation.`,
    answer: `Computer Science/IT + Math and Statistics + Domain/Business Knowledge

Data science sits at the intersection of Computer Science/IT (including machine learning), Math and Statistics (including traditional research), and Domain/Business Knowledge (including software development). It is an interdisciplinary field spanning mathematics, statistics, information science, and computer science, using computational analysis of large datasets as its primary scientific method.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492902-5jsard954in.jpeg",
    position: 14,
  },
  {
    id: "cmo2dsplr001c04l13bpf02pg",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Jim Gray's four paradigms of science?

Jim Gray (computer scientist, Turing Award 1998) articulated this framework.`,
    answer: `1. Empirical, 2. Theoretical, 3. Computational, 4. Data-driven (data-intensive) research

The first three paradigms are: Empirical (based on observation/experience), Theoretical (basic/pure research), and Computational (advanced computing capabilities). Data science adds a fourth: data-driven or data-intensive research. As Jim Gray stated, 'Everything about science is changing because of the impact of information technology.'`,
    imageUrl: null,
    position: 15,
  },
  {
    id: "cmo2dsplr001d04l1oiag8q4d",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Why did data science emerge in the 21st century?

Three synergistic factors drove its rise.`,
    answer: `Cheaper/faster computing (Moore's Law), breakthroughs in quantitative/predictive models, and the explosion of available data

Moore's Law enabled affordable, powerful hardware. Advances in social network analysis and deep learning expanded predictive modeling. The 'Data Deluge' came from online collaborative platforms (Wikipedia 2001, OpenStreetMap 2004), social media (Facebook 2004, Twitter 2006, Instagram 2010), open-source software, and data becoming a raw material of business.`,
    imageUrl: null,
    position: 16,
  },
  {
    id: "cmo2dsplr001e04l11t91sy0o",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `What does Moore's Law state?

Gordon Moore published this observation in 1965.`,
    answer: `The number of transistors on an integrated circuit doubles approximately every two years

Published by Gordon E. Moore in Electronics magazine (April 19, 1965). Capabilities directly linked to this trend include processing speed, memory capacity, sensors, number and size of camera pixels, and the amount of data that can be stored and processed. This trend held for more than half a century.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492912-3o8e11rsjl3.jpeg",
    position: 17,
  },
  {
    id: "cmo2dsplr001f04l1qtbidsj0",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `How does Big Data shift causality vs. correlation?

Consider what we gain and what we lose when we move from samples to all data.`,
    answer: `Big Data shifts focus from causality (why) to correlation (what), and from sampling to analyzing all data

Traditional statistics infer from samples to populations. Big Data initially referred to datasets exceeding computer memory capacity. Its key characteristic is working at a scale that cannot be done smaller, enabling new insights but often only revealing what (correlations) rather than why (causal mechanisms). It also makes inferential statistics less necessary since the full population may be available.`,
    imageUrl: null,
    position: 18,
  },
  {
    id: "cmo2dsplr001g04l1ssfqi6k7",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Field technique vs. experimental approach?

Consider where each method takes place and how much control is exercised.`,
    answer: `Field technique observes phenomena as they naturally occur; experimental approach manipulates and controls factors in a laboratory

Field technique: the researcher goes into the natural environment and records what happens (e.g., observing wild animals). Experimental approach: variables are controlled and manipulated under laboratory conditions to establish causal relationships (e.g., testing animals in standardized lab conditions). Each has trade-offs in ecological validity versus internal validity.`,
    imageUrl: null,
    position: 19,
  },
  {
    id: "cmo2dsplr001h04l1bgdqenjs",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `What is citizen science data? (Transfermarkt example)

From the Hoenig et al. (2022) paper.`,
    answer: `Citizen science data comes from publicly accessible, open-collaborated online databases maintained by volunteer editors

Transfermarkt.com is a citizen science-based database founded in 2000 that collects data on professional football players (market value, injuries, performance), updated daily by editors and volunteer 'data scouts.' Anyone can suggest changes. The Hoenig 2022 study analyzed 21,598 injuries from 11,507 players across 10 seasons (2009/10–2018/19) in the top 5 European leagues.`,
    imageUrl: null,
    position: 20,
  },
  {
    id: "cmo2dsplr001i04l15cuautqu",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Transfermarkt injury rate vs. established databases?

Hoenig et al. (2022) compared four data sources.`,
    answer: `Transfermarkt reported 0.63 injuries/player-season vs. 1.51–2.52 in other databases — indicating severe underreporting

The UEFA injury surveillance study reported 2.01/player-season; the media-based study 2.52; the insurance database 1.51. Transfermarkt's rate was roughly one-quarter of others. The largest gaps were in minor (1–7 day) and moderate (8–28 day) injuries. 98.6% of Transfermarkt injuries were time-loss injuries, making it useless for studying non-time-loss events.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492859-f1e0bjfl8p9.jpeg",
    position: 21,
  },
  {
    id: "cmo2dsplr001j04l1he4w41ia",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Which injuries are valid in Transfermarkt data?

Think about the characteristics that make certain injuries more likely to be reported.`,
    answer: `Severe injuries with high media visibility — e.g., ACL ruptures (median 194 days) and Achilles tendon ruptures

Validity was indicated for severe, high-profile injuries such as anterior cruciate ligament ruptures, Achilles tendon ruptures, and fractures of the upper extremity. High media coverage and an active user community drive better reporting. The median time-loss for ACL injuries in Transfermarkt (194 days, IQR 179–240) was similar to prior scientific studies, supporting this limited use case.`,
    imageUrl: null,
    position: 22,
  },
  {
    id: "cmo2dsplr001k04l1k9bmw2aa",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Most common injury locations in Transfermarkt?

From the descriptive results of Hoenig et al. (2022).`,
    answer: `Thigh (25.1%), Knee (23.4%), Ankle (14%), Lower leg (10.7%) — lower extremity = ~86% of all injuries

Of 21,562 injuries analyzed, the dominant locations were thigh, knee, ankle, and lower leg. Lower extremity injuries collectively accounted for approximately 86% of all injuries. By tissue type, the most commonly injured were muscle/tendon (64.6%), joint/ligament (13.7%), superficial tissue/skin (10.3%), and bone (7.6%). Notably, injury location data was missing in 32.7% of cases.`,
    imageUrl: null,
    position: 23,
  },
  {
    id: "cmo2dsplr001l04l1hrei6xyq",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Injury rates by league in Transfermarkt study?

Consider what country-level factors shaped the data.`,
    answer: `Bundesliga highest (1.08/season), Ligue 1 lowest (0.28/season); driven mainly by active user communities and media coverage

Bundesliga: 1.08; Serie A: 0.73; LaLiga: 0.60; Premier League: 0.47; Ligue 1: 0.28 injuries per player-season. The highest percentage change in reporting per season was Spain (18.1%), lowest Great Britain (6.1%). Higher German incidences are likely due to Germany's more active volunteer community. Media coverage also matters — players with high media attention have more accurately reported injuries.`,
    imageUrl: null,
    position: 24,
  },
  {
    id: "cmo2dsplr001m04l1jpsc8sja",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Key limitations of citizen science injury databases?

Name at least four distinct limitations.`,
    answer: `Retrospective design, uncertain data quality, missing injury details (~32%), no training exposure data, and community-dependent accuracy

Key limitations include: (1) retrospective study design, (2) uncertain data quality without medical verification, (3) missing injury location (32.7%) and type (32.0%) data, (4) no data on training exposure, (5) dependency on an active volunteer community, (6) inability to capture non-time-loss injuries (only 1.4% of entries), (7) no re-injury classification. Even medical staff under-report injuries up to 40% of the time.`,
    imageUrl: null,
    position: 25,
  },
  {
    id: "cmo2dsplr001n04l19t9syjpk",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Standard definition of a reportable football injury?

Fuller et al. (2006) established this consensus definition.`,
    answer: `A physical complaint sustained by a player that results from a football match or football training

This definition by Fuller et al. (2006) was used in the Hoenig study to filter Transfermarkt entries, excluding illnesses (e.g., flu) and non-medical reasons (e.g., fitness). Injury severity is classified as: minimal/mild = 1–7 days absence, moderate = 8–28 days, severe = >28 days. In Transfermarkt, 38.3% of injuries were severe (>28 days), much higher than in other databases.`,
    imageUrl: null,
    position: 26,
  },
  {
    id: "cmo2dsplr001o04l173sy2mag",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Why is critical thinking essential in science?

Beyond simply accepting published findings.`,
    answer: `Not every published statement is true; critical thinking means evaluating whether a claim is fully, partly, or not true

Critical/rational thinking is a way of deciding whether a claim is true, false, sometimes true, or partly true. Scientific publications can contain errors, unsupported conclusions, or findings that apply only under specific conditions. Research opportunities exist to confirm or refute 'known facts' and to investigate under what conditions they hold. Peer review reduces but does not eliminate errors.`,
    imageUrl: null,
    position: 27,
  },
  {
    id: "cmo2dsplr001p04l1ysrsw27p",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Big Data's impact on inferential statistics?

Consider what happens when you have the entire population rather than a sample.`,
    answer: `When you have all the data (the full population), inferential statistics become unnecessary — descriptive statistics suffice

Inferential statistics were invented to generalize from samples to populations when full data was unavailable. Big Data enables analysis at a scale that includes all (or nearly all) relevant cases, making it unnecessary to infer population characteristics. This is a paradigm shift: the lecture illustrates this by 'crossing out' inferential statistics when the full population is available.`,
    imageUrl: null,
    position: 28,
  },
  {
    id: "cmo2dsplr001q04l1zozrgn8f",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Error Bot: what did it disprove?

The study used over 40,000 typing errors from Microsoft researchers.`,
    answer: `A computer bot making random human-style letter substitutions produced just as many 'sexual' typos as real people — disproving Freudian motivation

The study used a Microsoft dataset of 40,000+ typing errors (self-corrected mistakes). Error Bot was programmed to substitute letters at the same frequencies humans typically do (e.g., replacing 't' with 's'). After millions of errors, the bot produced equally numerous 'Freudian' mistakes (e.g., 'seashell' → 'sexshell'). This shows such slips are entirely explained by letter-substitution frequency, not subconscious desire.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398492916-m2a4jho1tuh.jpeg",
    position: 29,
  },
  {
    id: "cmo2dsplr001r04l1u1plcgmt",
    deckId: "cmo2dspkt000w04l1c7tfbcno",
    question: `Is 'data science' just rebranded statistics?

Nathaniel Silver's critique is relevant here.`,
    answer: `Data science is often used interchangeably with business analytics, business intelligence, predictive modeling, and statistics — the distinction is partly marketing

Nathaniel Silver (statistician, b. 1978) quipped that 'data scientist is a sexed-up term for a statistician.' Data science is defined as an interdisciplinary field using computational analysis of large datasets as its primary scientific method and promoting open data environments. It encompasses more than statistics by including software engineering and domain knowledge, but its novelty relative to statistics is debated.`,
    imageUrl: null,
    position: 30,
  },
  {
    id: "cmo2dsqje001t04l1geqzjdjg",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Node vs. link?`,
    answer: `A node (also called a vertex) represents an entity in the network — such as a person, webpage, or ant colony worker. A link (also called an edge or arc) represents a relationship or interaction between two nodes. For example, in a friendship network, each person is a node and each friendship is a link.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494151-403mnoihcp5.jpeg",
    position: 0,
  },
  {
    id: "cmo2dsqje001u04l1ocneh832",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `What does node degree mean?`,
    answer: `The degree of a node is the number of links (edges) directly connected to it — i.e., its number of immediate neighbours. A high degree means the node is well connected. For example, in a friendship network, a person with 50 friends has degree 50. In a scale-free network, high-degree nodes are called hubs.`,
    imageUrl: null,
    position: 1,
  },
  {
    id: "cmo2dsqje001v04l1pfuqkpc2",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Clustering coefficient: regular vs. random?`,
    answer: `The clustering coefficient measures how connected a node's neighbours are to each other — i.e., what fraction of a node's possible neighbour-pairs are actually linked. A regular (ordered) network has a high clustering coefficient because neighbours tend to be densely interconnected. A random network has a low clustering coefficient because links are placed at random with no local tendency to cluster.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494159-ut73zmjmrb.jpeg",
    position: 2,
  },
  {
    id: "cmo2dsqje001w04l1r0bp2wel",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `How is an Erdos-Renyi network built?`,
    answer: `A random network is built by taking N nodes and connecting each pair of nodes with a fixed probability p, independently of all other pairs. For each potential pair, a random process (like rolling a die) determines whether a link is added. The result is a network where connections are distributed uniformly at random. Example: with 5 nodes (Mike, Sara, Bill, Zoe, and others), each pair is evaluated and linked with probability p.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494138-l9s5d9kylpe.jpeg",
    position: 3,
  },
  {
    id: "cmo2dsqje001x04l1xa0nf959",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Degree distribution shape in random networks?`,
    answer: `In a random network the degree distribution follows a Poisson (bell-shaped) distribution. Because each link is added independently with probability p, the number of links any node accumulates approximates a binomial distribution, which converges to a Poisson for large N. This means most nodes have close to the average degree, and very high or very low degrees are rare.`,
    imageUrl: null,
    position: 4,
  },
  {
    id: "cmo2dsqje001y04l1hr4xhx7h",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Path length: regular vs. random network?`,
    answer: `Path length is the number of links that must be traversed to get from one node to another; average path length is this measure averaged over all pairs of nodes. A regular (ordered/ring lattice) network has large average path length because nodes are only connected to nearby neighbours. A random network has small average path length because random long-range links act as shortcuts across the network.`,
    imageUrl: null,
    position: 5,
  },
  {
    id: "cmo2dsqje001z04l1soz32z2m",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Who coined six degrees of separation?`,
    answer: `The concept was first articulated by Hungarian writer Frigyes Karinthy (1887-1938) in his 1929 short story "Chains" (Lancszemek), published in his book "Everything Is Different" (Minden Maskeppen Van). Karinthy proposed that any two people in the world could be connected through a chain of no more than five acquaintances (i.e., six steps).`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494140-abnxnrmhap4.jpeg",
    position: 6,
  },
  {
    id: "cmo2dsqje002004l1su4dj6gp",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Milgram's 1967 experiment: key finding?`,
    answer: `Milgram's experiment, published in Psychology Today (1967), generated 300 letter chains from starting individuals in Nebraska and Kansas, tasking each person to forward a letter to a target person in Boston using only personal acquaintances. Of the 300 chains, 64 reached the target. The median chain length was 6 intermediaries, empirically supporting the six degrees of separation idea.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494148-wucgzd2glk.jpeg",
    position: 7,
  },
  {
    id: "cmo2dsqje002104l146ftqn3e",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Small-world vs. regular vs. random networks?`,
    answer: `A small-world network (Watts & Strogatz, 1998) occupies a middle ground: it has HIGH clustering (like a regular lattice) AND small average path length (like a random network). It is created by taking a regular ring lattice and rewiring a small fraction of links at random, adding shortcuts. Regular networks have high clustering but large path length; random networks have low clustering but small path length.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494145-fo7es8sf3ek.jpeg",
    position: 8,
  },
  {
    id: "cmo2dsqje002204l16z0pbj8s",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Watts-Strogatz key insight?`,
    answer: `Watts and Strogatz showed that for a large regular network, only a small fraction of randomly rewired (shortcut) links is sufficient to dramatically reduce average path length while preserving high clustering. Their conclusion: small-world networks are widespread and not confined to social networks — examples include the neural network of C. elegans, the US power grid, and the collaboration graph of film actors.`,
    imageUrl: null,
    position: 9,
  },
  {
    id: "cmo2dsqje002304l1i9ue2gkm",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `What does the Kevin Bacon game illustrate?`,
    answer: `The game, created by Craig Fass, Christian Gardner, Brian Turtle, and Mike Ginelli in 1994, challenges players to connect any film actor to Kevin Bacon through the shortest chain of co-starring relationships (Bacon number). It illustrates the small-world property: the actor network has small average path length, so most actors can be reached from Kevin Bacon in very few steps — Jodie Foster and Charles Chaplin both have a Bacon number of 2.`,
    imageUrl: null,
    position: 10,
  },
  {
    id: "cmo2dsqje002404l1depj47rg",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Two mechanisms behind scale-free networks?`,
    answer: `Barabasi and Albert identified two ingredients: (1) Growth — the network continuously expands by the addition of new nodes over time; and (2) Preferential attachment — new nodes are more likely to connect to existing nodes that already have many connections. This "rich get richer" dynamic causes a small number of nodes (hubs) to accumulate disproportionately many links.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494149-wy439c9ka5.jpeg",
    position: 11,
  },
  {
    id: "cmo2dsqje002504l1v9zxub08",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `How does preferential attachment work?`,
    answer: `When a new node (e.g., Bob) enters the network, the probability that it connects to any existing node is proportional to that existing node's current degree. So a highly connected node like John (with 3 links) is more likely to become Bob's friend than a low-degree node like Chloe (with 1 link). This is step 2 of the Barabasi-Albert recipe, following network growth (step 1).`,
    imageUrl: null,
    position: 12,
  },
  {
    id: "cmo2dsqje002604l1oclebek3",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Power-law vs. Poisson degree distribution?`,
    answer: `In a scale-free network, the degree distribution follows a power-law (long-tailed) distribution: most nodes have very few connections, while a small number of hubs have extremely many. This contrasts with a random network's Poisson (bell-shaped) distribution, where most nodes cluster around the average degree. In a scale-free network, there is no characteristic scale for connectivity — hence the name.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494156-ohv2rjj14a9.jpeg",
    position: 13,
  },
  {
    id: "cmo2dsqje002704l1rapaz8zh",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `What are hubs and why do they matter?`,
    answer: `Hubs are the rare nodes with an extremely large number of connections — they sit in the long tail of the power-law distribution. Despite being few in number, hubs are critical: they dramatically shorten average path lengths, make the network robust to random node failures, but vulnerable to targeted attacks on hubs. Examples include highly connected websites on the internet or superspreaders in disease transmission.`,
    imageUrl: null,
    position: 14,
  },
  {
    id: "cmo2dsqje002804l13snd1rbu",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Random vs. scale-free graph structure?`,
    answer: `In a random network, most nodes are linked by roughly the same number of connections (average-linked), producing a symmetric, homogeneous-looking graph with no dominant hubs. In a scale-free network, a few nodes are extremely well connected (hubs, shown as large orange nodes) while the majority have only 1-2 links — producing a heterogeneous, star-like topology with many peripheral leaves.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494176-2bfqc9uv2ux.jpeg",
    position: 15,
  },
  {
    id: "cmo2dsqje002904l1etr6910z",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `What is homophily?`,
    answer: `Homophily is the principle that "similarity breeds connection": contact between similar people occurs at a higher rate than between dissimilar people. Personal networks tend to be homogeneous with respect to sociodemographic characteristics (age, sex, race/ethnicity, education — Bott 1929; Loomis 1946) and psychological characteristics (intelligence, attitudes, aspirations — Almack 1922; Richardson 1940). Colloquially: "birds of a feather flock together."`,
    imageUrl: null,
    position: 16,
  },
  {
    id: "cmo2dsqje002a04l159tresr1",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Milgram's design and completion rate?`,
    answer: `Milgram sent letters to random starting individuals in Nebraska/Kansas, asking each recipient to forward the letter to a named target person in Boston by passing it only to personal acquaintances who might know the target. The protocol generated 300 letter chains. Only 64 (about 21%) reached the target, with a typical (median) chain length of 6 links — illustrating that the social world is surprisingly small despite geographic distances.`,
    imageUrl: null,
    position: 17,
  },
  {
    id: "cmo2dsqje002b04l1wju31uuh",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Nodes and edges in Segarra's Henry VI model?`,
    answer: `In Segarra et al.'s word-adjacency network, nodes represent "function words" (target words) — words like prepositions, conjunctions, and articles that express grammatical relationships but carry little lexical meaning. An edge (arc) is drawn from word A to word B when B is a function word that appears within the five words following A in the text. This creates an author-specific network fingerprint.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494167-sbl9g4p2lsc.jpeg",
    position: 18,
  },
  {
    id: "cmo2dsqje002c04l179xmdgni",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Why function words for authorship attribution?`,
    answer: `Function words (prepositions, conjunctions, articles, etc.) are used unconsciously and habitually by authors, making their proximity patterns author-specific "fingerprints" independent of the topic being written about. Content words vary with subject matter, making them unreliable for authorship attribution. Segarra et al. argue that the choices of words and how far apart they are placed vary enough from author to author to serve as a reliable authorship test.`,
    imageUrl: null,
    position: 19,
  },
  {
    id: "cmo2dsqje002d04l114nyf7he",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Segarra et al.: Henry VI authorship conclusions?`,
    answer: `Using word-adjacency networks built from function word proximities, Segarra et al. found evidence consistent with collaborative authorship of the three Henry VI plays (which appeared in the 1623 First Folio). Their network-based method confirmed findings from other independent authorship-attribution studies, strengthening confidence that multiple authors — including Shakespeare and contemporaries — contributed to these plays.`,
    imageUrl: null,
    position: 20,
  },
  {
    id: "cmo2dsqje002e04l1xqxqhr5b",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Mersch's ant colony SNA finding?`,
    answer: `Mersch et al. tracked individually tagged workers in six Camponotus fellah ant colonies over 41 days, analyzing over 9 million interactions. Network analysis revealed three distinct functional groups: nurses, cleaners, and foragers. The rate of interactions was much higher within each group than between groups, and workers moved sequentially from one group to the next as they aged — showing that spatial fidelity is a key regulator of ant social organization.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494161-4ta1d9ui9uu.jpeg",
    position: 21,
  },
  {
    id: "cmo2dsqje002f04l1mjm69dzh",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Christakis & Fowler: smoking cessation in networks?`,
    answer: `Using data from 12,067 people in the Framingham Heart Study (1971-2003), Christakis and Fowler found that smoking cessation by a network contact significantly reduced a person's own chances of smoking. The strongest effect was from a spouse quitting (67% decrease), followed by a friend quitting (36%), a coworker in a small firm quitting (34%), and a sibling quitting (25%). Groups of interconnected people tended to stop smoking together.`,
    imageUrl: null,
    position: 22,
  },
  {
    id: "cmo2dsqje002g04l1vp6t9v4v",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `What is the Framingham Heart Study?`,
    answer: `The Framingham Heart Study is a long-running longitudinal cohort study initiated in 1948 in Framingham, Massachusetts, originally enrolling 5,209 participants. In 1971 a second generation of 5,124 offspring and spouses was added. Because it tracked 12,067 people repeatedly from 1971 to 2003, it provided a rich longitudinal social network dataset allowing researchers like Christakis and Fowler to examine how behaviors (e.g., smoking) spread through network ties over time.`,
    imageUrl: null,
    position: 23,
  },
  {
    id: "cmo2dsqje002h04l1mbjkx8u9",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Regular lattice to small-world: the transformation?`,
    answer: `A regular network arranges nodes in a ring where each node connects only to its k nearest neighbours (e.g., 4 neighbours), giving high clustering but large path length. A small-world network is obtained from the regular network by the "rewiring" process: randomly redirecting a small fraction of existing links to distant nodes. These shortcuts dramatically reduce path length while leaving clustering largely intact — creating the small-world property.`,
    imageUrl: null,
    position: 24,
  },
  {
    id: "cmo2dsqje002i04l1x4fbu4nw",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `"Rich get richer": which network type?`,
    answer: `The "rich get richer" dynamic (also called preferential attachment) means that nodes which already have many connections are more likely to receive additional new connections. This arises in scale-free networks (Barabasi-Albert model) because new nodes join the network and probabilistically attach to high-degree existing nodes. Over time this produces a power-law degree distribution with a few dominant hubs.`,
    imageUrl: null,
    position: 25,
  },
  {
    id: "cmo2dsqjf002j04l1hb02cmjp",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Segarra's moving window technique?`,
    answer: `In Segarra et al.'s method, a moving window of fixed size (five words ahead) slides through the text. For each target function word A encountered, the method looks at the five words that follow it. If another function word B appears within that window, a directed edge A→B is recorded in the word-adjacency network. Adjacencies that span a speech break are excluded. This process builds a network that captures each author's unconscious syntactic habits.`,
    imageUrl: null,
    position: 26,
  },
  {
    id: "cmo2dsqjf002k04l1bu8kk2as",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Path length vs. clustering during rewiring?`,
    answer: `As rewiring probability increases from 0 (fully regular) to 1 (fully random), average path length drops sharply even with a very small fraction of rewired links — because just a few shortcuts drastically reduce the number of steps needed to traverse the network. Clustering coefficient, by contrast, decreases more slowly. The zone where path length is already small but clustering is still high is the small-world regime.`,
    imageUrl: null,
    position: 27,
  },
  {
    id: "cmo2dsqjf002l04l1ycbde15c",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Why is Segarra's method robust to spelling variation?`,
    answer: `The method is robust to spelling variation for two reasons: first, spelling choices in early printed books were largely made by compositors (typesetters), not authors, and these affect all authors equally; second, with large enough samples the distortions cancel each other out. Additionally, the proximity-adjacency feature being measured — how close function words appear to each other — is relatively immune to censorship, oath removal, and other textual interventions that affect specific word choices.`,
    imageUrl: null,
    position: 28,
  },
  {
    id: "cmo2dsqjf002m04l1opblute1",
    deckId: "cmo2dsqiv001s04l1inwgpgfl",
    question: `Real-world examples of small-world or scale-free networks?`,
    answer: `Small-world properties have been found in: the neural network of C. elegans (neuroscience), the US electrical power grid (engineering), and film actor collaboration networks (humanities). Scale-free properties appear in the World Wide Web, genetic regulatory networks, and citation networks. The implication is that these network structures are universal, self-organizing phenomena — not specific to human social behavior — and that models like Barabasi-Albert apply across disciplines.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398494173-z0txycjgj2.jpeg",
    position: 29,
  },
  {
    id: "cmo2dsrcc002o04l1do87zmg2",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google's official mission?

What is Google's official mission statement, and how does it differ from the company's core business activities?`,
    answer: `To Organize the World's Information

Google's mission is 'To organize the world's information and make it universally accessible and useful.' Its core business activities are internet searching and online advertising — the mission is broader and more idealistic than the revenue-generating products.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495178-p3apbui0be.jpeg",
    position: 0,
  },
  {
    id: "cmo2dsrcc002p04l1x1cgxq7w",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google founders' two core principles?

What two philosophical principles guided Google's founders from the start?`,
    answer: `Google's Core Philosophy

1. 'You can make money without doing evil.' 2. 'Work should be challenging and the challenge should be fun.' These principles shaped Google's approach to advertising ethics and workplace culture.`,
    imageUrl: null,
    position: 1,
  },
  {
    id: "cmo2dsrcc002q04l1nroalac3",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Who founded Google?

Who founded Google, and what academic backgrounds did their families have?`,
    answer: `Sergey Brin and Larry Page

Google was founded by Sergey Brin (born 1973; father: mathematician, mother: economist) and Larry Page (born 1973; father: professor of computer science, mother: computer science instructor). Both were Stanford computer science PhD students.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495161-8hng9sma45m.jpeg",
    position: 2,
  },
  {
    id: "cmo2dsrcc002r04l156va07w2",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Stanford project that sparked Google?

How did the 1996 Stanford Digital Library Technologies Project lead directly to Google's creation?`,
    answer: `From Books to the Web

The project aimed to envision the library of the future by integrating books with the World Wide Web and enabling jumping from book to book in cyberspace. Because only a few books were digitized, Brin and Page applied the same link-navigation ideas to webpages instead — the direct precursor to Google's search engine.`,
    imageUrl: null,
    position: 3,
  },
  {
    id: "cmo2dsrcc002s04l1lcs50p0c",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google milestones: 1998–2006 order?

Place these Google milestones in order: Google goes public, YouTube acquisition, Googleplex headquarters, Google Earth launch, Google Inc. founded.`,
    answer: `Google Milestones (1998–2006)

1998: Google Inc. founded. 1999: Googleplex headquarters established. 2004: Google goes public. 2005: Google Earth launched. 2006: Google acquires YouTube.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495156-5w6r5mtc1kr.jpeg",
    position: 4,
  },
  {
    id: "cmo2dsrcc002t04l1nmtyt74j",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Pre-Google web search problem?

Why was searching the web frustrating before Google, and what specifically was wrong with older search engines' results?`,
    answer: `Irrelevance and Burial

Before Google, older search engines returned results that were often irrelevant. Sites of genuine interest were either buried far down the results list or missing altogether. The fundamental unsolved problem was: how to retrieve relevant information from massive online datasets.`,
    imageUrl: null,
    position: 5,
  },
  {
    id: "cmo2dsrcc002u04l16k73t2b9",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Links as votes — why count quality?

How does Google's approach treat hyperlinks as a form of democratic voting, and why is raw link count insufficient?`,
    answer: `Links as Votes — But Quality Matters

Google lets webpages 'rank themselves' by treating each outgoing link as a vote for the destination page. However, raw link count (popularity) is insufficient: links from low-quality pages should count against a site. What matters is receiving links from good pages — making the quality of voters, not just the count, decisive.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495159-fmrxcs67oj6.jpeg",
    position: 6,
  },
  {
    id: "cmo2dsrcc002v04l14x33dlzs",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `PageRank's circular definition problem?

What is the 'circular approach' problem that PageRank must solve, and how does it resolve it?`,
    answer: `Circular Definition Resolved by the Network

The circular problem: a page is good if good pages link to it — but who decides which pages are good in the first place? PageRank resolves this by letting the network itself decide through an iterative mathematical procedure rather than any external authority.`,
    imageUrl: null,
    position: 7,
  },
  {
    id: "cmo2dsrcc002w04l14gyvijpk",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `PageRank score range and constraint?

What numerical range does a PageRank score fall within, and what constraint must all PageRanks in a network satisfy together?`,
    answer: `0 to 1, Summing to 1

Each page receives a PageRank score between 0 and 1. Across all pages in the network, all PageRank values must sum to exactly 1. This makes PageRank a probability distribution — it represents the proportion of time a hypothetical web surfer would spend on each page.`,
    imageUrl: null,
    position: 8,
  },
  {
    id: "cmo2dsrcc002x04l1t09ewijr",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `What does PageRank actually measure?

How does the 'hypothetical web surfer' model explain what a PageRank score actually measures?`,
    answer: `Proportion of Surfer Time

PageRank measures how important a page is relative to all others by computing the proportion of time a hypothetical random web surfer would spend on that page. A page with a high PageRank is one where the surfer ends up more often, reflecting both the quantity and quality of links pointing to it.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495173-s0aouihsphg.jpeg",
    position: 9,
  },
  {
    id: "cmo2dsrcc002y04l1m0u6x6c1",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `PageRank step 1: initialization?

How does the PageRank procedure initialize scores before any iteration begins?`,
    answer: `Egalitarian Initialization

The procedure starts with an egalitarian stance: every page is given an equal portion of the total PageRank. For example, in a 3-page network (X, Y, Z), each page starts with a score of 1/3. This equal division ensures the scores sum to 1 before any updates occur.`,
    imageUrl: null,
    position: 10,
  },
  {
    id: "cmo2dsrcc002z04l1dqpfkncw",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `PageRank step 2: each update round?

What happens during each update round of the PageRank iterative procedure?`,
    answer: `Fluid Distribution via Outgoing Links

In each round, every page distributes its current PageRank score equally among all its outgoing links — like fluid flowing to connected pages. Each receiving page sums up all the incoming fluid. This redistribution step is repeated across all pages simultaneously each round.`,
    imageUrl: null,
    position: 11,
  },
  {
    id: "cmo2dsrcc003004l1rs8syi50",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `PageRank step 3: convergence?

How does the PageRank procedure know when to stop iterating, and what does convergence mean?`,
    answer: `Convergence: Scores Stabilize

The iterative procedure keeps redistributing PageRank scores across rounds until the values stop changing significantly — the procedure 'converges.' Convergence means the scores have settled into a stable distribution that reflects the true relative importance of each page in the network.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495172-8pihorb3crm.jpeg",
    position: 12,
  },
  {
    id: "cmo2dsrcc003104l1up6tr9jk",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `3-page network: which page wins?

In a 3-page network where X links to Y and Z, Y links to Z, and Z links back to X — which page is most important and why?`,
    answer: `Z is Most Important

Page Z is the most important because it has the most incoming links (2 incoming links: from X and from Y). Page Y is the least important because it has only 1 incoming link and no page with high rank links to it. PageRank confirms this: Z accumulates the most score after convergence.`,
    imageUrl: null,
    position: 13,
  },
  {
    id: "cmo2dsrcc003204l1ii3gffad",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google Trends: raw counts or relative?

What does Google Trends measure, and how is this different from raw search volume counts?`,
    answer: `Normalized Search Interest Over Time

Google Trends measures the relative search interest for a query over time — not the raw number of searches. Data is normalized so that the peak search volume for a term in the selected time period equals 100, and all other time points are scaled proportionally. This allows comparison across terms with very different absolute volumes.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495192-hl70j0vbk9m.jpeg",
    position: 14,
  },
  {
    id: "cmo2dsrcc003304l1ve06jtjg",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `What is data normalization?

How does normalization transform raw data, and what problem does it solve when comparing different datasets?`,
    answer: `Scaling to a Common Reference Point

Normalization rescales raw data so that values fall within a standard range (e.g., 0–100), with one reference point (typically the maximum) set to the scale's top value. It solves the problem of comparing datasets with different absolute magnitudes — for example, comparing search interest in 'flu' vs. 'elections' despite one being searched far more often.`,
    imageUrl: null,
    position: 15,
  },
  {
    id: "cmo2dsrcc003404l1rnyxcz4n",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google Trends: value of 100 vs. 50?

In Google Trends data, what does a value of 100 represent, and what does a value of 50 represent?`,
    answer: `100 = Peak; 50 = Half the Peak

In Google Trends, a value of 100 represents the point of highest search interest for the term within the selected time frame. A value of 50 means search interest at that point was half of the peak value. A value of 0 means insufficient data (not necessarily zero searches).`,
    imageUrl: null,
    position: 16,
  },
  {
    id: "cmo2dsrcc003504l1vs6ub32w",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google Trends research applications?

How have researchers used Google Trends data to study real-world societal phenomena? Give two concrete examples.`,
    answer: `Societal Signals in Search Data

Researchers have used Google Trends to study: (1) Public health — tracking flu search queries to predict influenza outbreaks before official CDC data is available. (2) Economics — using searches for 'unemployment benefits' or 'car purchases' to forecast economic indicators. Search data acts as a real-time proxy for public attention and behavior.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495163-rb0fndb6vfn.jpeg",
    position: 17,
  },
  {
    id: "cmo2dsrcc003604l1ss8wi0t7",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Culturomics: what is it?

What is 'culturomics' as defined by Michel et al. (2011), and what type of data source does it rely on?`,
    answer: `Quantitative Study of Culture via Books

Culturomics is the application of high-throughput data collection and quantitative analysis to the study of human culture. Michel et al. (2011) built it on a corpus of over 5 million digitized books, using the frequency of words and phrases (n-grams) over time as a proxy for cultural trends. It extends rigorous scientific inquiry to the humanities.`,
    imageUrl: null,
    position: 18,
  },
  {
    id: "cmo2dsrcc003704l1a6pbunh5",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google Books corpus size?

How large was the corpus used by Michel et al. (2011), and what fraction of all books ever published does it represent?`,
    answer: `5.2 Million Books, ~4% of All Published

Michel et al. constructed a corpus of 5,195,769 digitized books, representing approximately 4% of all books ever published. The corpus contained over 500 billion words in multiple languages including English, French, Spanish, German, Russian, and Hebrew. Books were drawn from over 40 university libraries and scanned by Google.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495184-l0nazn0ut0e.jpeg",
    position: 19,
  },
  {
    id: "cmo2dsrcc003804l1933u782q",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `N-gram definition and frequency?

What is an n-gram in the context of the Michel et al. (2011) culturomics study, and how is its usage frequency calculated?`,
    answer: `A String of N Consecutive Words

An n-gram is a sequence of n words uninterrupted by a space. A 1-gram is a single word (e.g., 'banana'); a 2-gram is two consecutive words (e.g., 'stock market'); a 5-gram is five words (e.g., 'the United States of America'). Usage frequency is the number of instances of that n-gram in a given year divided by the total number of words in the corpus that year.`,
    imageUrl: null,
    position: 20,
  },
  {
    id: "cmo2dsrcc003904l17ohln8jm",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Culturomics: how fast do we forget?

What did Michel et al. find about how quickly society forgets historical events, based on book frequency data?`,
    answer: `We Forget Faster Over Time

Analysis showed that references to historical years (e.g., '1883', '1910', '1950') peak shortly after the event and then decay. The half-life of references is getting shorter over time — '1880' took 32 years to decline to half its peak value, but '1973' took only 10 years. Precise dates are increasingly common, but collective memory fades faster with each generation.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495190-hna4h1ogvte.jpeg",
    position: 21,
  },
  {
    id: "cmo2dsrcc003a04l1gxtvjhoo",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Culturomics: detecting censorship how?

How did Michel et al. use n-gram frequency data to detect and measure censorship, and what is a 'suppression index'?`,
    answer: `Frequency Drops as a Censorship Signal

Suppression of a person or idea leaves a measurable fingerprint: their name's frequency drops abnormally. A 'suppression index' (s) is calculated by dividing a person's frequency during the suppression period by their frequency before and after. In Nazi Germany, 9.8% of individuals showed strong suppression (s < 1/5), revealing systematic book censorship that would otherwise be hard to detect.`,
    imageUrl: null,
    position: 22,
  },
  {
    id: "cmo2dsrcc003b04l1zq4iglxp",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `How has fame changed over centuries?

According to Michel et al.'s analysis of famous people, how has the nature of fame changed between the 19th and 20th centuries?`,
    answer: `Fame Arrives Faster but Fades Quicker

The study found that famous people today become famous sooner (age of initial celebrity declined from ~43 to ~29 years) and the rise to prominence is faster (doubling time fell from 8.1 to 3.3 years). However, fame is increasingly short-lived: the post-peak half-life of fame dropped from 120 to 71 years. People are more famous than ever but forgotten more rapidly.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495170-dxu1ojvokm.jpeg",
    position: 23,
  },
  {
    id: "cmo2dsrcc003c04l17bp6qe2i",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Irregular verb regularization trend?

How did Michel et al. use n-gram data to study the regularization of irregular English verbs, and what trend did they find?`,
    answer: `Irregular Verbs Are Slowly Regularizing

By tracking irregular past-tense forms (e.g., 'burnt/burned', 'spelt/spelled'), the study found that verbs are gradually regularizing — shifting from -t endings to -ed endings. High-frequency irregulars ('found', 'went') are stable; low-frequency ones regularize faster. Six verbs (burn, chide, smell, spell, spill, thrive) regularized between 1800 and 2000. This regularization is slow: it took 200 years for 'chugged' to go from 10% to 90% regularity.`,
    imageUrl: null,
    position: 24,
  },
  {
    id: "cmo2dsrcc003d04l1m4tvwj8q",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `English lexicon size and growth rate?

How large is the English lexicon according to Michel et al., and how rapidly has it grown in the past 50 years?`,
    answer: `Over 1 Million Words and Growing

Michel et al. estimated the English lexicon contained approximately 544,000 words in 1900, 597,000 in 1950, and over 1,022,000 by 2000. The lexicon is growing by approximately 8,500 words per year, increasing its size by over 70% in the past 50 years. A word is defined as 'common' if its frequency is greater than one per billion in the corpus.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495166-ejjcofmjfnm.jpeg",
    position: 25,
  },
  {
    id: "cmo2dsrcc003e04l1h4bend2d",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Technology adoption speed over eras?

How did Michel et al. measure the speed of cultural adoption of inventions, and what trend emerged across different eras?`,
    answer: `Technology Spreads Faster Over Time

By tracking when invention-related words first appeared and how quickly their frequency rose, Michel et al. found that cultural adoption of technology is accelerating. Inventions from the 1800–1840 cohort took over 66 years to reach widespread impact; the 1880–1920 cohort did so in 27 years. The telephone and radio illustrate this compression of adoption timelines.`,
    imageUrl: null,
    position: 26,
  },
  {
    id: "cmo2dsrcc003f04l1wyvh70lv",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Culturomics for epidemiology?

How does culturomics contribute to the field of historical epidemiology, and what example did Michel et al. provide?`,
    answer: `Flu Pandemic Peaks Match Known Outbreaks

By plotting the frequency of 'influenza' over time, Michel et al. found that peaks in book mentions correspond precisely to dates of known pandemics: the Russian Flu, Spanish Flu, and Asian Flu. This validates culturomics as a tool for historical epidemiology — the corpus serves as a proxy record of which diseases captured public attention and when.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495186-adkrwn42y1.jpeg",
    position: 27,
  },
  {
    id: "cmo2dsrcc003g04l1mujuu7ko",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Google Trends vs. culturomics: key difference?

How does Google Trends data differ from the book-frequency data used in culturomics in terms of what they measure and their time coverage?`,
    answer: `Real-Time Web Searches vs. Long-Term Book Culture

Google Trends captures real-time public search behavior — what people are actively looking for online — and is most useful for data from the late 1990s onward. Culturomics (Michel et al.) tracks word frequencies in published books from 1800 to 2000, reflecting slower cultural shifts in what authors wrote about. Trends = present attention; culturomics = long-term cultural record.`,
    imageUrl: null,
    position: 28,
  },
  {
    id: "cmo2dsrcc003h04l1remaf1cd",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `PageRank vs. simple link counting?

Why does PageRank produce different rankings than simply counting the number of inbound links to each page?`,
    answer: `Weighted by Source Quality

Simple link counting treats all incoming links equally. PageRank weights each incoming link by the PageRank of the linking page — a link from a high-PageRank page transfers more value than a link from a low-PageRank page. For example, one link from a top academic journal page is worth far more than 100 links from low-traffic personal blogs.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398495183-bxq0pqgu3qp.jpeg",
    position: 29,
  },
  {
    id: "cmo2dsrcc003i04l1x5aok1jt",
    deckId: "cmo2dsrbz002n04l165d6su0x",
    question: `Brin & Page's 1998 foundational paper?

What was the title and significance of the 1998 paper by Brin and Page that described Google's search engine?`,
    answer: `'The Anatomy of a Large-Scale Hypertextual Web Search Engine'

Published in Computer Networks and ISDN Systems (Vol. 30, 1998, pp. 107–117), this paper by Sergey Brin and Lawrence Page described Google's architecture and the PageRank algorithm. It became one of the most cited papers in computer science, with over 21,000 citations by 2021, establishing the theoretical and engineering foundations for modern web search.`,
    imageUrl: null,
    position: 30,
  },
  {
    id: "cmo2dss2s003k04l1f57ohac4",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `What is machine learning?

How does machine learning differ from traditional programming in terms of how a computer acquires knowledge?`,
    answer: `Learning from Data, Not Rules

Machine learning (ML) teaches computers to learn from experience rather than following explicitly programmed rules. ML algorithms use computational methods to learn information directly from data — for example, a spam filter learns what spam looks like from thousands of labeled emails rather than from a hand-coded rulebook.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496142-t67dyy3vzx.jpeg",
    position: 0,
  },
  {
    id: "cmo2dss2s003l04l1klpxu01h",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Supervised vs. unsupervised: key difference?

How does supervised learning differ from unsupervised learning in terms of the data it requires?`,
    answer: `Labels Make the Difference

Supervised learning develops a predictive model using both input data AND labeled output data (e.g., predicting Titanic survival using passenger records with known outcomes). Unsupervised learning groups and interprets data using input data ONLY, with no labels — it discovers hidden structure on its own (e.g., clustering passengers by height and weight into groups without being told the groups).`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496134-zzr5xl6zy5j.jpeg",
    position: 1,
  },
  {
    id: "cmo2dss2s003m04l1yedkp5tf",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Classification vs. regression: when to use?

When should a supervised ML problem be treated as classification rather than regression?`,
    answer: `Categories vs. Continuous Numbers

Classification is used when the output belongs to a discrete category — e.g., whether an email is spam or genuine, or whether a tumor is cancerous or benign. Regression is used when the output is a continuous real number — e.g., predicting age, temperature, or the price of a house. The Titanic survival prediction (survived/perished) is a classification problem.`,
    imageUrl: null,
    position: 2,
  },
  {
    id: "cmo2dss2s003n04l1pmcvyc16",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Why test on unseen data?

Why must a model be evaluated on a test set rather than on the same data used to train it?`,
    answer: `Avoiding Overfitting

Evaluating on training data is unreliable because the model can simply memorize all training examples and will always predict the correct label for any point it has already seen — a phenomenon called overfitting. The test set consists of unseen data, so performance on it measures how well the model generalizes to new, real-world inputs.`,
    imageUrl: null,
    position: 3,
  },
  {
    id: "cmo2dss2s003o04l1r0i1lqt9",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Overfitting: what goes wrong?

What happens to a model that overfits, and why does it fail on new data?`,
    answer: `Memorization Instead of Generalization

Overfitting occurs when a model learns the training data too precisely — including its noise and outliers — instead of learning the underlying pattern. The result is artificially high accuracy on training data but poor accuracy on unseen data. Decision trees are especially prone to overfitting by building many branches that capture irregularities rather than general rules.`,
    imageUrl: null,
    position: 4,
  },
  {
    id: "cmo2dss2s003p04l13kk7tbg3",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Holdout procedure: three subsets?

What are the three subsets in the holdout procedure and what is each used for?`,
    answer: `Train / Validate / Test

The holdout procedure randomly divides a dataset into three subsets: (1) Training set — used to build the predictive model; (2) Validation set — used to assess model performance during training and fine-tune parameters (not all algorithms need this); (3) Test set (unseen data) — used to estimate the model's likely future performance on completely new data.`,
    imageUrl: null,
    position: 5,
  },
  {
    id: "cmo2dss2s003q04l1nhgv76bg",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `k-Fold cross-validation: how does it work?

How does k-fold cross-validation use data differently from a single holdout split, and what is the final performance metric?`,
    answer: `Rotating Test Folds

The dataset is randomly split into k equal folds. In each of k rounds, one fold serves as the test set while the remaining k-1 folds form the training set. The model is retrained and scored each round. The final performance metric is the average score across all k tests. With k=5, for example, every data point is used exactly once for testing and four times for training.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496128-yt1sh2948id.jpeg",
    position: 6,
  },
  {
    id: "cmo2dss2s003r04l1l1luq14u",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Accuracy formula — and its flaw?

What does classification accuracy measure, and when does it give a misleading picture of model performance?`,
    answer: `Correct Predictions / Total Predictions

Classification accuracy = (TP + TN) / (TP + FP + TN + FN) — the proportion of all predictions that are correct. It is the most commonly used metric but is unreliable when classes are imbalanced. Example: if only 10 of 100 patients have cancer, a model that always predicts 'no cancer' achieves 90% accuracy while completely failing its purpose.`,
    imageUrl: null,
    position: 7,
  },
  {
    id: "cmo2dss2s003s04l1sxnx4mdb",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Confusion matrix: four values?

What four values does a binary confusion matrix contain, and what does each represent?`,
    answer: `TP, FP, FN, TN

A confusion matrix is a 2x2 table comparing actual vs. predicted class labels: True Positives (TP) — correctly predicted positive; False Negatives (FN) — positive predicted as negative; False Positives (FP) — negative predicted as positive; True Negatives (TN) — correctly predicted negative. By convention, the rarest class is treated as the 'positive' class.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496131-msc2m2chqeq.jpeg",
    position: 8,
  },
  {
    id: "cmo2dss2s003t04l16m0d19wf",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Precision: formula and meaning?

What question does precision answer, and what is its formula using confusion matrix terms?`,
    answer: `How Often Is a Positive Prediction Correct?

Precision = TP / (TP + FP). It answers: 'Of all instances the model labeled positive, how many actually were positive?' A model with low precision generates many false alarms. Example: if a cancer model predicts 5 cancerous cases but only 3 are truly cancerous, precision = 3/5 = 60%.`,
    imageUrl: null,
    position: 9,
  },
  {
    id: "cmo2dss2s003u04l1j49ajgiv",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Recall vs. precision: key difference?

How does recall differ from precision, and why is high recall especially important in medical diagnosis?`,
    answer: `How Many Actual Positives Were Found?

Recall (also called Sensitivity or True Positive Rate) = TP / (TP + FN). It answers: 'Of all actual positive cases, how many did the model correctly identify?' Unlike precision (which focuses on predicted positives), recall focuses on actual positives. In cancer detection, a missed positive (false negative) is dangerous, so high recall is critical even at the cost of some false alarms.`,
    imageUrl: null,
    position: 10,
  },
  {
    id: "cmo2dss2s003v04l1vqmt22e0",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Specificity: what does it measure?

What does specificity measure, and how does it differ from recall?`,
    answer: `True Negative Rate

Specificity = TN / (TN + FP). It measures how many of the actually negative cases were correctly identified as negative — i.e., 'Of all healthy patients, how many were correctly told they are healthy?' Recall measures performance on the positive class; specificity measures performance on the negative class. Together they give a complete picture of binary classifier performance.`,
    imageUrl: null,
    position: 11,
  },
  {
    id: "cmo2dss2s003w04l1vujc4wqi",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `F1 score: why not just average?

Why use the F1 score instead of simply averaging precision and recall?`,
    answer: `Harmonic Mean of Precision and Recall

F1 = (2 * precision * recall) / (precision + recall). The harmonic mean penalizes extreme imbalances between precision and recall more than a simple average would. A high F1 score requires both that positive predictions are correct (precision) and that few actual positives are missed (recall). Example: precision=0.6, recall=0.75 gives F1=0.67.`,
    imageUrl: null,
    position: 12,
  },
  {
    id: "cmo2dss2s003x04l1vu5ewz10",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `k-NN classification: four steps?

Walk through the four steps k-NN uses to assign a class label to a new data point.`,
    answer: `Classify by Majority Vote of Neighbors

1. Choose a positive integer k and present the new sample. 2. Find the k training instances closest (by distance) to the new sample. 3. Identify the most common class among those k neighbors (majority vote). 4. Assign that class label to the new sample. Example: with k=3 on the Titanic dataset, the three most similar passengers by age, class, and sex determine the survival prediction.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496140-zst6ndewff.jpeg",
    position: 13,
  },
  {
    id: "cmo2dss2s003y04l160y4wb3h",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `k-NN pros and cons?

What advantages make k-NN appealing, and what limitations make it impractical at scale?`,
    answer: `Simple but Memory-Hungry

Pros: makes no assumptions about data distribution; simple to understand and explain; versatile (works for both classification and regression); achieves high accuracy. Cons: must store the entire training dataset in memory (high memory requirement); prediction is slow because every new query requires computing distances to all training points; sensitive to irrelevant features; generally outperformed by more sophisticated supervised models.`,
    imageUrl: null,
    position: 14,
  },
  {
    id: "cmo2dss2s003z04l1qcw3nui1",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Decision tree: three node types?

What are the three types of nodes in a decision tree and what role does each play?`,
    answer: `Root, Branch, and Leaf

A decision tree has three node types: (1) Root node — represents the entire training set and contains the best splitting attribute; (2) Branch (internal) nodes — represent sub-questions based on attribute values; (3) Leaf nodes — represent final class predictions (no further splitting). The tree is read from root to leaf, following branches that match a data point's attribute values.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496136-q2unk67gajj.jpeg",
    position: 15,
  },
  {
    id: "cmo2dss2s004004l1ynqpxnlc",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Decision tree: three build steps?

What three recursive steps are followed to build a decision tree from training data?`,
    answer: `Split, Divide, Repeat

1. Place the best attribute/feature at the root of the tree (chosen to maximize classification accuracy). 2. Divide the dataset into subsets where each subset contains data with the same value or range for that attribute. 3. Repeat steps 1 and 2 on each subset recursively until all branches end in leaf nodes (pure or acceptable classes). Continuous features are discretized before use.`,
    imageUrl: null,
    position: 16,
  },
  {
    id: "cmo2dss2s004104l1kkb7m6ku",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Decision tree pros and cons?

How does a decision tree's interpretability advantage trade off against its accuracy and overfitting risks?`,
    answer: `Transparent but Prone to Overfitting

Pros: easy to explain as a set of human-readable rules; mirrors how humans make sequential decisions; complex models can be simplified with visualization. Cons: generally lower prediction accuracy than other ML algorithms; high probability of overfitting — building many branches to capture noise and outliers; calculations become complex with many class labels.`,
    imageUrl: null,
    position: 17,
  },
  {
    id: "cmo2dss2t004204l1k3c2kplh",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Titanic survival rates by class?

How did survival rates differ across first, second, and third class on the Titanic, and what does this pattern suggest for ML?`,
    answer: `Class Strongly Predicted Survival

Of 2,229 passengers and crew, 1,502 died (67%). Survival rates by class: First class — 202/325 survived (62.2%); Second class — 118/285 survived (41.4%); Third class — 178/706 survived (25.2%). The steep gradient shows passenger class is a highly discriminatory feature for a predictive model, reflecting unequal access to lifeboats and deck locations.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496132-hwm9mdpn87r.jpeg",
    position: 18,
  },
  {
    id: "cmo2dss2t004304l1pojr0sp6",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Titanic tree: male vs. female rates?

Using a decision tree trained on Titanic data, what survival rate did male adult passengers have versus female non-third-class passengers?`,
    answer: `Sex and Class Were the Key Splits

The Titanic decision tree splits first on sex (Male/Female), then on adult status or class. Male adults had only a 20% survival rate. Male children in 3rd class had 27%; male children not in 3rd class had 100%. Female passengers in 3rd class had 46% survival; female passengers not in 3rd class had 93% survival. Sex was the strongest single predictor, consistent with the 'women and children first' boarding protocol.`,
    imageUrl: null,
    position: 19,
  },
  {
    id: "cmo2dss2t004404l1yltsdc1n",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Turing's three seminal contributions?

What were Alan Turing's three major contributions that shaped computing and AI?`,
    answer: `Theory, Practice, and Philosophy

1. Theoretical: Turing developed the mathematical model of a universal computing machine (the Turing Machine) to solve the Entscheidungsproblem, formalizing the concepts of algorithm and computation. 2. Practical: He was actively involved in building early electronic programmable computers and led WWII codebreaking work. 3. Philosophical: He proposed the Imitation Game (1950), an operational definition of machine intelligence that set artificial intelligence in motion.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496139-5fpbmdctu6q.jpeg",
    position: 20,
  },
  {
    id: "cmo2dss2t004504l1c296y8ow",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Turing Test: original setup vs. modern?

How did Turing's original Imitation Game differ from the version commonly described today?`,
    answer: `Man vs. Woman vs. Machine

In Turing's 1950 original, a man and a woman in separate rooms communicate with an interrogator only by teletype. The man tries to convince the interrogator he is the woman; the woman tries to assert her real identity. The man is then replaced by a machine — if the interrogator still cannot tell the machine from the woman, the machine is said to be intelligent. The modern version simply pits a machine against a person, which is generally agreed to be harder for the machine to pass.`,
    imageUrl: null,
    position: 21,
  },
  {
    id: "cmo2dss2t004604l14hoxjqi2",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Failing Turing Test: what does it prove?

What is the logical status of failing the Turing Test — does it prove a machine (or person) is not intelligent?`,
    answer: `Failure Proves Nothing; Passing Is Sufficient

Turing intended the test to provide only a sufficient condition for intelligence, not a necessary one. Failing proves nothing — many humans would fail if placed in the role of the machine, yet they are clearly intelligent. The test was designed so that passing it would give strong grounds for attributing intelligence, but not passing it cannot be used as evidence of non-intelligence.`,
    imageUrl: null,
    position: 22,
  },
  {
    id: "cmo2dss2t004704l1hz2dc93h",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Chinese Room: Searle's argument?

How does Searle's Chinese Room challenge the idea that passing the Turing Test demonstrates genuine understanding?`,
    answer: `Syntax Without Semantics

Searle (1980) imagined an English speaker locked in a room, manipulating Chinese symbols using rule tables to produce correct Chinese responses — without understanding any Chinese. An outside observer would believe the room understands Chinese. Searle argued this shows that a machine passing the Turing Test could be manipulating symbols without any genuine understanding or consciousness, just as the English speaker has no comprehension of Chinese.`,
    imageUrl: null,
    position: 23,
  },
  {
    id: "cmo2dss2t004804l1hhndgz9p",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Harnad's T2, T3, T4 distinguished?

What distinguishes T2, T3, and T4 in Harnad's five-level Turing Test hierarchy?`,
    answer: `From Text to Body to Neurons

T2 (standard Turing Test): symbols-in/symbols-out via teletype — indistinguishable in linguistic capacity. T3 (Total/Robotic Turing Test): the teletype screen is removed; the machine must also be indistinguishable in all robotic/behavioral capacities including physical appearance. T4 (Microfunctional Indistinguishability): internal indistinguishability down to every neuron and neurotransmitter. Harnad argues T3 is the right level for cognitive modeling.`,
    imageUrl: null,
    position: 24,
  },
  {
    id: "cmo2dss2t004904l1kqtgm6ip",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `French: why embodiment matters for Turing?

Why does French argue that only a machine that has experienced the world as humans have could pass a rigorously administered Turing Test?`,
    answer: `Associative Networks Require Embodied Experience

French argued that subcognitive questions (e.g., 'Rate how much holding Coca-Cola in your mouth feels like having pins and needles in your feet') probe low-level associative networks built through a lifetime of embodied interaction with the world. These networks are products of human sense organs, bodily location, and sensory experience. A machine without that history cannot reproduce the human statistical response profile across many such questions, even if it can guess plausibly on one or two.`,
    imageUrl: null,
    position: 25,
  },
  {
    id: "cmo2dss2t004a04l1j2mufmpa",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Turing Machine and halting problem?

What did Turing prove with his 1936 paper on computable numbers, and why was it significant?`,
    answer: `Universal Computation Has Limits

In 'On Computable Numbers, with an Application to the Entscheidungsproblem' (1936), Turing introduced the Turing Machine — a mathematical model capable of performing any conceivable computation expressible as an algorithm. He proved the halting problem is undecidable: it is impossible to algorithmically determine whether an arbitrary Turing machine will ever halt. This paper also introduced the Universal Turing Machine, the conceptual basis of all general-purpose computers.`,
    imageUrl: null,
    position: 26,
  },
  {
    id: "cmo2dss2t004b04l1cf3ysjs0",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Bombe: how did it crack Enigma?

What was the Bombe, and how did Turing's statistical approach make it effective against the Enigma cipher?`,
    answer: `Electromechanical Contradiction-Finder

The Bombe was an electromechanical machine Turing specified within weeks of arriving at Bletchley Park. Using a 'crib' (a fragment of probable plaintext), it searched through the approximately 10^19 possible Enigma rotor settings by chaining logical deductions and ruling out settings that caused contradictions. Turing also developed Banburismus, a sequential statistical technique using 'decibans' (units of evidence), to substantially reduce the settings needing testing. Over 200 Bombes were in operation by the end of WWII.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398496145-rqhn4cbjjp.jpeg",
    position: 27,
  },
  {
    id: "cmo2dss2t004c04l15tzt088y",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Turing 1950: child-mind strategy?

In his 1950 paper, Turing suggested an alternative strategy to building an adult-intelligent machine. What was it, and why did he prefer it?`,
    answer: `Simulate a Child's Mind and Educate It

Rather than directly programming adult-level intelligence, Turing proposed simulating a child's mind and then subjecting it to a course of education. He believed this approach was more tractable than hand-coding all adult knowledge. This idea anticipated modern machine learning: instead of specifying all rules, train a system from data. A reversed form of the Turing Test — CAPTCHA — is used today to determine whether a user is human or machine.`,
    imageUrl: null,
    position: 28,
  },
  {
    id: "cmo2dss2t004d04l1krf2bav6",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Loebner Prize: why dismissed?

What does the Loebner Prize award, and why do most serious AI researchers dismiss it?`,
    answer: `Restricted Chatbots Are Not Real AI

Originating in 1991, the Loebner Prize offers $100,000 to the first program to pass an unrestricted Turing Test. Early competitions restricted topics and banned 'trick questions,' violating the spirit of Turing's 'anything-goes' imitation game. Dennett, who chaired early events, said 'passing the Turing Test is not a sensible research and development goal for serious AI.' Minsky offered $100 to anyone who could convince Loebner to end the competition. Domain restrictions make the test trivially gameable (Weizenbaum's silent typewriter could pass a test for infant autism).`,
    imageUrl: null,
    position: 29,
  },
  {
    id: "cmo2dss2t004e04l1c33atxu5",
    deckId: "cmo2dss1w003j04l1v2l5f884",
    question: `Turing: conviction, death, pardon?

What legal fate did Turing suffer after WWII, how did he die, and how was he eventually recognized?`,
    answer: `Persecution, Cyanide, and Posthumous Pardon

In 1952 Turing was convicted of 'gross indecency' for his homosexual relationship and accepted chemical castration (DES injections) as an alternative to prison. On 8 June 1954, his housekeeper found him dead — cyanide poisoning, officially ruled suicide. In 2009, PM Gordon Brown issued a public apology. On 24 December 2013, Queen Elizabeth II granted a posthumous royal pardon. The 'Alan Turing Law' (Policing and Crime Act 2017) retroactively pardoned all men convicted under similar historical legislation in England and Wales.`,
    imageUrl: null,
    position: 30,
  },
  {
    id: "cmo2dssvl004g04l1vw3a7602",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Facebook depression model AUC?

What AUC did the Facebook language-based model achieve when predicting a future depression diagnosis in the EMR, and what does this value signify?`,
    answer: `AUC = 0.69 (all predictors); AUC = 0.72 (6-month window)

Using all predictors (language, demographics, post length/frequency, temporal patterns), the model reached AUC = 0.69, just below the customary good-discrimination threshold of 0.70. Restricting to the 6 months immediately before the first documented diagnosis raised AUC to 0.72, surpassing that threshold. AUC summarizes the ROC curve — an AUC of 0.50 equals chance performance.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497109-hlatr3xj7xd.jpeg",
    position: 0,
  },
  {
    id: "cmo2dssvl004h04l1myhjki1o",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Why Facebook language beats other features?

How does Facebook language compare to demographics and posting meta-features as a predictor of depression, and what does this reveal about language?`,
    answer: `Language captures depression-related variance already encoded in other feature groups

In the Eichstaedt et al. (2018) study, adding demographic or temporal features to a language-only model did not substantially improve prediction accuracy. This indicates that Facebook language already captures the variance explained by those other groups — language is the dominant signal for depression screening from social media.`,
    imageUrl: null,
    position: 1,
  },
  {
    id: "cmo2dssvl004i04l1g7sh2wxb",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Earliest advance depression prediction from Facebook?

How far before the first documented EMR diagnosis of depression can Facebook language yield above-chance prediction, and what is the minimum AUC at that window?`,
    answer: `~3 months in advance; minimum AUC ≈ 0.62 (P = 0.002)

Eichstaedt et al. found that minimal but statistically significant prediction (AUC ≈ 0.62) was possible approximately 3 months before the first medical record of depression. The finding supports the idea that social media language could enable earlier identification of depression than traditional clinical encounters allow.`,
    imageUrl: null,
    position: 2,
  },
  {
    id: "cmo2dssvl004j04l1hh41k8qz",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Top LIWC predictors of future depression?

Which LIWC dictionary categories were significantly associated with future depression status in the Eichstaedt et al. study, and in which direction?`,
    answer: `Positive predictors: first-person singular pronouns, negative emotions, sadness, discrepancy, health

After Benjamini-Hochberg correction, significant LIWC predictors included: first-person singular pronouns (I, me; β=0.19), negative emotions (β=0.14), sadness (β=0.17), discrepancy (β=0.12), and health (β=0.11). All had positive beta coefficients, meaning higher use predicted higher probability of depression. This reflects emotional, interpersonal, and cognitive patterns of depression.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497106-0h07ukky2uu.jpeg",
    position: 3,
  },
  {
    id: "cmo2dssvl004k04l1o16vq44e",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Why do "I/me" predict depression?

Why do first-person singular pronouns (I, me) predict depression in social media text, according to the Eichstaedt et al. findings?`,
    answer: `Signals self-focused rumination and preoccupation with the self

Depressed individuals used significantly more first-person singular pronouns (β=0.19, p<0.001). This is interpreted as reflecting cognitive preoccupation with the self — a hallmark of rumination. A meta-analysis confirmed first-person singular pronouns are among the most robust language markers of cross-sectional depression (meta-analytic r=0.13), and the Eichstaedt study extends this to longitudinal prediction from public social media.`,
    imageUrl: null,
    position: 4,
  },
  {
    id: "cmo2dssvl004l04l1y2nml61m",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `LDA topics in the Facebook depression study?

How was Latent Dirichlet Allocation (LDA) used in the Eichstaedt et al. study, and how many topics were extracted?`,
    answer: `200 LDA topics modeled from 949,530 Facebook statuses to capture semantic content

LDA was applied to all Facebook statuses from 1,175 consenting patients to extract 200 topics — clusters of co-occurring words reflecting latent semantic themes (e.g., depressed mood, somatic complaints, hostility). Each user was represented by their relative frequency across these 200 topics. Of the 200, 7 topics were individually significant predictors of future depression status at p<0.05 after Benjamini-Hochberg correction.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497097-17ep1dswvg8.jpeg",
    position: 5,
  },
  {
    id: "cmo2dssvl004m04l1axd6lnux",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `How were depressed and control patients matched?

How did Eichstaedt et al. construct the comparison between depressed and non-depressed patients, and why was a 1:5 ratio used?`,
    answer: `For each depressed patient, 5 controls matched by data availability were randomly selected to approximate true prevalence (~16.7%)

Of 683 patients with sufficient Facebook data, 114 had depression in their EMR. Each was matched to 5 random controls without depression, yielding 114+570=684 patients (one excluded for <500 words). The 1:5 ratio was chosen to simulate the true population prevalence of depression (~16.7%), unlike prior work that used balanced 1:1 ratios, giving AUC=0.69 and F1=0.66.`,
    imageUrl: null,
    position: 6,
  },
  {
    id: "cmo2dssvl004n04l1t6n6a1jd",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Facebook model vs. self-report screening tools?

How does the Facebook language prediction model's accuracy compare to validated self-report depression screening tools benchmarked against EMR diagnoses?`,
    answer: `Facebook model (AUC=0.69) roughly matches self-report screening surveys benchmarked against EMR records

Noyes et al. (2011) benchmarked Medicare claim data against depression screening scales; their results (shown in Fig. 2) cluster near the Facebook model's ROC curve. This suggests Facebook-based prediction performs comparably to existing screening instruments while being unobtrusive — patients do not need to complete a questionnaire.`,
    imageUrl: null,
    position: 7,
  },
  {
    id: "cmo2dssvl004o04l1s4quzjv2",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Ethical concerns in social media mental health screening?

What privacy and ethical concerns does Eichstaedt et al. raise about using social media language for depression screening?`,
    answer: `Concerns include informed consent, data ownership, protected health information, and algorithmic influence on behavior

The study notes that applying such algorithms could transform social media content into protected health information, raising patients' right to remain autonomous in health decisions. Guidelines are needed on who accesses the data and for what purpose. Additionally, people may change what they post if they know their language is being analyzed, undermining data validity.`,
    imageUrl: null,
    position: 8,
  },
  {
    id: "cmo2dssvl004p04l1apjab1i3",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Golder & Macy: what did they study?

What phenomenon did Golder and Macy investigate, and what data source did they use to measure it at global scale?`,
    answer: `Diurnal and seasonal mood rhythms measured via LIWC analysis of 509 million public Twitter messages from 2.4 million individuals in 84 countries

Golder and Macy examined whether positive affect (PA) and negative affect (NA) vary systematically by time of day, day of week, and season — and whether these patterns are consistent across diverse cultures. They collected up to 400 public messages per user between February 2008 and January 2010, restricting to English speakers.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497095-7mflu8ctpj8.jpeg",
    position: 9,
  },
  {
    id: "cmo2dssvl004q04l1uh25yso8",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `PA and NA — one scale or two?

How did Golder & Macy's Twitter data support or challenge the idea that positive and negative affect are simply opposite ends of a single emotional dimension?`,
    answer: `PA and NA are independent dimensions — they move in parallel, not as mirror images (r = -0.08)

The correlation between PA and NA in the Twitter dataset was only r = -0.08, confirming they are largely independent. Both had morning peaks and overnight drops, but their trajectories were not mirror images. For example, NA was lowest in the morning and rose to a nighttime peak, while PA peaked early morning and again near midnight — two distinct patterns, not one inverted pattern.`,
    imageUrl: null,
    position: 10,
  },
  {
    id: "cmo2dssvl004r04l1eh385zvr",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Diurnal positive affect pattern on Twitter?

Describe the within-day pattern of positive affect (PA) observed by Golder & Macy, including peak times and the key exception for weekends.`,
    answer: `PA peaks early morning (~6-9 am), drops midday, and rises again near midnight; weekend morning peak is delayed ~2 hours

Across all days, PA was highest shortly after waking, consistent with sleep restoration refreshing positive emotion. PA declined through the work day and partially recovered in the evening. On weekends, the morning PA peak was delayed by approximately 2 hours (M=9:53 a.m. vs. 8:04 a.m. weekdays), suggesting the morning peak is driven by the biological clock, not alarm clocks.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497100-5mqe426xqk6.jpeg",
    position: 11,
  },
  {
    id: "cmo2dssvl004s04l10tvayrwz",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Weekend effect on positive affect?

What specific pattern in PA on Saturday and Sunday did Golder & Macy observe, and what does it suggest about the sources of positive affect?`,
    answer: `PA was generally higher on weekends (M=0.058) than weekdays (M=0.054, p<0.001), attributed to reduced work stress and later, self-determined wake times

PA levels were elevated on Saturday and Sunday compared to any weekday. The morning peak was also delayed by ~2 hours on weekends. Because the shape of the rhythm was otherwise similar across days, this points to sleep and circadian biology (not solely work stress) as a primary driver. The weekend boost reflects more discretionary time and less sleep deprivation.`,
    imageUrl: null,
    position: 12,
  },
  {
    id: "cmo2dssvl004t04l1rnkiebw8",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Seasonal mood: phase-shift vs. absolute daylength?

What did Golder & Macy find regarding seasonal mood variation, and which specific hypothesis about daylength did their data support?`,
    answer: `Relative daylength change (not absolute daylength) predicts seasonal PA — supporting the phase-shift hypothesis

Absolute daylength had no significant effect on PA (r=3.14×10⁻⁵, p=0.905) or NA. However, the rate of change in daylength did predict PA (r=1.21×10⁻³, p<0.001): PA was higher when days were getting longer (approaching summer solstice) and lower when days were shortening (approaching winter solstice). This supports the phase-shift hypothesis — the timing of the dawn signal to the circadian clock matters, not merely total light exposure.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497093-nnss5c82eoa.jpeg",
    position: 13,
  },
  {
    id: "cmo2dssvl004u04l17549wszy",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `LIWC: what it measures and how it was used?

What is LIWC, and how did Golder & Macy use it to operationalize positive and negative affect in Twitter data?`,
    answer: `LIWC (Linguistic Inquiry and Word Count) is a validated lexicon that maps words to psychological dimensions; PA and NA word frequencies served as affect proxies

LIWC counts word frequencies across nearly 4,500 keywords grouped into ~80 psychologically validated dimensions, including positive affect (PA: e.g., enthusiasm, delight) and negative affect (NA: e.g., distress, fear). Bantum and Owen (2007) validated LIWC's sensitivity=0.88 and specificity=0.97 for emotional expression. Golder & Macy computed the proportion of PA and NA words in each tweet to track individual-level emotional state across time.`,
    imageUrl: null,
    position: 14,
  },
  {
    id: "cmo2dssvl004v04l15lds9srs",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Diurnal mood rhythms across cultures?

How similar were the diurnal mood rhythms across the four English-speaking regional groups studied by Golder & Macy?`,
    answer: `Patterns were statistically indistinguishable across Africa, India, UK/Australia, and US/Canada (χ²=852,551, p<0.001 confirms similarity of shapes)

While the χ² test revealed the patterns were not identical in absolute level, the shapes were remarkably similar: a morning PA rise, a midday dip, and an evening recovery with a sharp NA drop overnight. Golder & Macy interpret this as strong evidence that affective rhythms reflect universal biological mechanisms (circadian clock and sleep) rather than culture-specific norms, given the diverse geographic and cultural contexts tested.`,
    imageUrl: null,
    position: 15,
  },
  {
    id: "cmo2dssvl004w04l1lbsdgzjn",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `UAE natural experiment: what did it reveal?

Why did Golder & Macy treat the United Arab Emirates as a natural experiment, and what did it reveal about the source of diurnal mood rhythms?`,
    answer: `UAE's Sunday-Thursday work week allows testing whether peak timing shifts with culture — it did, but only slightly, supporting biological primacy

In the UAE, the work week runs Sunday to Thursday, so weekend effects should appear Friday-Saturday. Golder & Macy found PA was indeed higher on Friday and Saturday (M=0.057) vs. weekdays. The morning peak was also slightly later than in Western countries, but the overall pattern mirrored global trends. This suggests the diurnal rhythm is primarily biologically driven, but culturally mediated work schedules modulate its exact timing.`,
    imageUrl: null,
    position: 16,
  },
  {
    id: "cmo2dssvl004x04l1aufqmz55",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Twitter data advantages over lab mood studies?

How does analyzing Twitter data improve on traditional laboratory or diary-based mood studies, according to Golder & Macy?`,
    answer: `Twitter provides real-time, spontaneous, individual-level affect data at massive global scale — avoiding memory bias and limited sample sizes

Traditional studies relied on retrospective self-reports (vulnerable to memory bias and experimenter demand effects) and sampled small, homogeneous groups (often American undergraduates). Twitter data was composed in the moment, not prompted by a researcher, covering millions of individuals across 84 countries and diverse demographics. This allows cross-societal tests of affective patterns and avoids the recall artifacts that plague diary studies.`,
    imageUrl: null,
    position: 17,
  },
  {
    id: "cmo2dssvl004y04l1vnptad93",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `What is deceptive opinion spam?

How does Ott et al. define deceptive opinion spam, and why is it more problematic than other forms of online spam?`,
    answer: `Fictitious opinions deliberately written to sound authentic — harder to detect than disruptive spam because they blend in with legitimate reviews

Deceptive opinion spam refers to fabricated reviews crafted to deceive readers into believing they reflect genuine experiences. Unlike disruptive opinion spam (ads, off-topic posts), which readers can easily identify and ignore, deceptive spam is designed to be indistinguishable from real reviews. Ott et al. note that humans perform roughly at chance when detecting it, making automated detection necessary.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497098-n13csqjlm38.jpeg",
    position: 18,
  },
  {
    id: "cmo2dssvl004z04l17qb2er2r",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `How was Ott et al.'s gold-standard dataset built?

How did Ott et al. create their gold-standard deceptive opinion spam dataset, and what was its final composition?`,
    answer: `400 deceptive reviews via Amazon Mechanical Turk + 400 truthful 5-star reviews from TripAdvisor for 20 Chicago hotels = 800 reviews total

For deceptive reviews, 400 Human Intelligence Tasks (HITs) were posted to AMT, instructing Turkers to write fake positive hotel reviews that sounded authentic; each Turker could submit only once per hotel. Truthful reviews were mined from the 6,977 reviews of the 20 most popular Chicago hotels on TripAdvisor, filtering to 5-star, English, ≥150-character reviews and sampling 20 per hotel using a log-normal distribution to match deceptive review lengths.`,
    imageUrl: null,
    position: 19,
  },
  {
    id: "cmo2dssvl005004l1f1dvl0qt",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Human accuracy detecting fake reviews?

How well did human judges perform at distinguishing deceptive from truthful hotel reviews in Ott et al., and what bias did they exhibit?`,
    answer: `Humans performed near chance (~61% best, ~53-57% others); all exhibited truth-bias (over-classifying as truthful)

Three undergraduate judges achieved 61.9%, 56.9%, and 53.1% accuracy on a balanced 160-review subset. Two of three (Judges 2 and 3) did not statistically outperform chance. All three judges exhibited truth-bias — a common finding in deception research (Vrij, 2008) — meaning they labeled fewer than 12% of reviews as deceptive. This bias reflects the difficulty humans have encoding and detecting spatial/contextual fabrication.`,
    imageUrl: null,
    position: 20,
  },
  {
    id: "cmo2dssvl005104l1qmsqf4eu",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Best automated classifier for fake reviews?

Which automated approach achieved the highest accuracy for deceptive opinion spam detection in Ott et al., and what accuracy did it reach?`,
    answer: `LIWC + BIGRAMS⁺ SVM achieved 89.8% accuracy — combining psycholinguistic and n-gram features

Three approaches were tested: genre identification (POS-SVM, 73%), psycholinguistic detection (LIWC-SVM, 76.8%), and text categorization (n-gram SVM/NB, up to 89.6%). The best single model was BIGRAMS⁺ SVM at 89.6%; combining LIWC features with bigrams (LIWC+BIGRAMS⁺ SVM) reached 89.8%. This combined model outperformed all human judges and every individual approach.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497108-8ztnohxbzg2.jpeg",
    position: 21,
  },
  {
    id: "cmo2dssvl005204l1i27c2cww",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Three automated detection frameworks in Ott et al.?

What are the three automated detection frameworks Ott et al. compare, and what feature set does each rely on?`,
    answer: `Genre identification (POS tags), psycholinguistic detection (LIWC dimensions), text categorization (n-grams: unigrams, bigrams, trigrams)

1. Genre identification: uses part-of-speech (POS) tag frequency distributions to distinguish 'informative' (truthful) from 'imaginative' (deceptive) writing genres. 2. Psycholinguistic deception detection: uses 80 LIWC dimensions capturing linguistic, psychological, personal-concern, and spoken-category features. 3. Text categorization: uses unigrams, bigrams⁺, or trigrams⁺ in Naive Bayes or SVM classifiers. Text categorization performed best individually; combining it with LIWC yielded the best overall result.`,
    imageUrl: null,
    position: 22,
  },
  {
    id: "cmo2dssvl005304l1b7yxhag7",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Spatial language in truthful vs. deceptive reviews?

How does the use of spatial language differ between truthful and deceptive hotel reviews, and what psychological theory explains this?`,
    answer: `Truthful reviews contain more spatial detail (small, bathroom, floor, location); deceptive reviews lack spatial specificity — explained by liars' difficulty encoding spatial information

Truthful reviews used more concrete spatial words (room, bathroom, small, floor), while deceptive reviews focused on external topics (husband, vacation, business). Vrij et al. (2009) showed that liars have difficulty encoding spatial information into their fabrications. The POS-SVM feature weights confirmed nouns (especially proper singular nouns) predicted truthful reviews, while verbs and pronouns predicted deceptive ones.`,
    imageUrl: null,
    position: 23,
  },
  {
    id: "cmo2dssvl005404l11f1v8cju",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Unigrams vs. bigrams vs. trigrams — which wins?

What are UNIGRAMS, BIGRAMS⁺, and TRIGRAMS⁺ as defined in Ott et al., and which performed best?`,
    answer: `BIGRAMS⁺ (unigrams + bigrams) outperformed UNIGRAMS alone; TRIGRAMS⁺ added only marginal gains

UNIGRAMS: individual word frequencies. BIGRAMS⁺: subsumes unigrams, adding two-word phrase frequencies. TRIGRAMS⁺: subsumes bigrams, adding three-word phrase frequencies. All features were lowercased and unstemmed. BIGRAMS⁺ SVM achieved 89.6% accuracy vs. UNIGRAMS SVM at 88.4%, suggesting that contextual two-word phrases capture deception cues beyond single words. The superscript + means each set subsumes the previous.`,
    imageUrl: null,
    position: 24,
  },
  {
    id: "cmo2dssvl005504l1ba1ka6b3",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Deceptive reviews as imaginative writing genre?

Why do Ott et al. frame deceptive opinion spam detection as a genre identification problem, and what genres do truthful and deceptive reviews resemble?`,
    answer: `Truthful reviews resemble informative writing; deceptive reviews resemble imaginative writing — both are classifiable by POS distributions

Drawing on Rayson et al. (2001), Ott et al. note that informative writing (nouns, prepositions, determiners) versus imaginative writing (verbs, adverbs, pronouns) have distinct POS distributions. Since truthful reviews draw on real memories (informative) while deceptive ones fabricate scenarios (imaginative), POS patterns can partially separate them. This framing also explains why deceptive reviews contain more superlatives — imaginative writing tends toward exaggeration.`,
    imageUrl: null,
    position: 25,
  },
  {
    id: "cmo2dssvl005604l1zwios9eg",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Cross-validation strategy in Ott et al.?

How did Ott et al. structure their cross-validation, and why was each fold organized by hotel rather than by individual review?`,
    answer: `5-fold nested cross-validation with all reviews from a hotel kept in the same fold, ensuring models are evaluated on reviews from unseen hotels

Each fold contained reviews from four of the 20 hotels, so that no hotel appeared in both training and test sets. This prevents leakage of hotel-specific language patterns across splits, providing a realistic estimate of how the model would generalize to reviews of hotels it has not seen. Model hyperparameters were selected on standard CV training folds; outer-loop folds evaluated final performance using micro-averaged precision, recall, and F-score.`,
    imageUrl: null,
    position: 26,
  },
  {
    id: "cmo2dssvl005704l1pj7w421w",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Why LIWC alone fails for deception detection?

What does Ott et al. conclude about relying solely on LIWC features for detecting deceptive reviews, and what alternative does better?`,
    answer: `LIWC captures general deception cues but misses context; n-gram (BIGRAMS⁺) features provide context-sensitive signals that outperform LIWC alone

LIWC-SVM reached only 76.8% accuracy. The authors argue a universal keyword-based lexicon (LIWC) is insufficient because deception is contextual and motivational. For example, deceptive positive hotel reviews show more positive and fewer negative emotion words — the opposite of general deception studies — because the goal is to convincingly praise. BIGRAMS⁺ captures this context, achieving 89.6% accuracy by learning hotel-review-specific language patterns.`,
    imageUrl: null,
    position: 27,
  },
  {
    id: "cmo2dssvl005804l1uk41o1zy",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Amazon Mechanical Turk for collecting fake reviews?

How did Ott et al. use Amazon Mechanical Turk (AMT) to gather deceptive reviews, and what quality controls were applied?`,
    answer: `400 HITs were posted (one per hotel per Turker); workers needed US location, ≥90% approval rating, and submissions had to be ≥150 characters and non-plagiarized

Each HIT instructed Turkers to pretend to be a hotel marketing employee writing a fake positive review sounding realistic. To ensure quality: only US-based Turkers with ≥90% approval could participate; each Turker submitted at most once per hotel; submissions were checked for plagiarism; reviews under 150 characters or targeting the wrong hotel were rejected. Workers had 30 minutes and were paid $1 per accepted submission. Collection took ~14 days for 400 satisfactory reviews.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497112-ex2d61r1uc6.jpeg",
    position: 28,
  },
  {
    id: "cmo2dssvl005904l10s4ruona",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Common NLP tool across all three studies?

Which text analysis tool appears across all three papers (Eichstaedt 2018, Golder & Macy 2011, Ott et al. 2011), and what role does it play in each?`,
    answer: `LIWC (Linguistic Inquiry and Word Count) is used in all three studies as a psycholinguistically validated feature extractor

Eichstaedt et al. used 73 LIWC dictionaries to identify depression language markers in Facebook posts (e.g., sadness β=0.17, first-person singular β=0.19). Golder & Macy used LIWC's PA and NA word lists to operationalize mood in 509 million tweets. Ott et al. used LIWC's 80 dimensions as features for a psycholinguistic deception detection classifier (76.8% accuracy). LIWC is thus a cross-domain standard tool in computational social science.`,
    imageUrl: "https://bq8okg9c8rzlol5m.public.blob.vercel-storage.com/imports/deck-import-1776398497104-dwhq4ei7ag.jpeg",
    position: 29,
  },
  {
    id: "cmo2dssvl005a04l1hkh6ydlu",
    deckId: "cmo2dssv5004f04l1b15iv48r",
    question: `Future of social media mental health screening?

What do the Eichstaedt et al. findings imply about the future feasibility and utility of social media data in public mental health?`,
    answer: `Social media screening could become a scalable, unobtrusive complement to traditional depression assessment as algorithms improve and social media integration grows

Eichstaedt et al. conclude that Facebook-based prediction (AUC up to 0.72) is comparable to validated screening surveys, is achievable up to 3 months in advance, and is passive — patients don't need to take a survey. The growing integration of social media into daily life, combined with improving machine-learning methods and longitudinal data richness, suggests these tools could eventually flag at-risk individuals early, reduce underdiagnosis, and shorten depressive episodes by enabling earlier intervention.`,
    imageUrl: null,
    position: 30,
  },
];

async function main() {
  const luigi = await prisma.user.upsert({
    where: { email: "qi975251@dal.ca" },
    update: {},
    create: {
      id: "seed-user-luigi",
      email: "qi975251@dal.ca",
      name: "Luigi",
      emailVerified: true,
      dalEmail: "qi975251@dal.ca",
      fieldOfStudy: "Computer Science",
    },
  });

  await prisma.account.upsert({
    where: { id: "seed-account-luigi" },
    update: {},
    create: {
      id: "seed-account-luigi",
      accountId: luigi.id,
      providerId: "credential",
      userId: luigi.id,
      password: await hashPassword("luigi1234"),
    },
  });

  // Seed a stable API key for Luigi so the deck-generator skill can use it
  const LUIGI_API_KEY = "flashcardbrowser_a4f8c2e6b1d3f7a9c5e2b4d6f8a1c3e5b7d9f2a4c6e8b1d3";
  await prisma.apiKey.upsert({
    where: { key: LUIGI_API_KEY },
    update: {},
    create: {
      id: "seed-apikey-luigi",
      userId: luigi.id,
      name: "Deck Generator (seeded)",
      key: LUIGI_API_KEY,
    },
  });

  // Seed decks
  for (const deck of DECKS) {
    await prisma.deck.upsert({
      where: { id: deck.id },
      update: { title: deck.title, description: deck.description, visibility: "PUBLIC", coverImage: deck.coverImage, deckType: "PERSONAL", courseCode: null },
      create: { ...deck },
    });
  }
  console.log(`  Upserted ${DECKS.length} decks`);

  // Seed flashcards
  for (const card of CARDS) {
    await prisma.flashcard.upsert({
      where: { id: card.id },
      update: { question: card.question, answer: card.answer, imageUrl: card.imageUrl, position: card.position },
      create: { ...card },
    });
  }
  console.log(`  Upserted ${CARDS.length} flashcards`);

  // Seed course collection
  await prisma.collection.upsert({
    where: { id: COURSE_COLLECTION_ID },
    update: { name: "Introduction to Data Science", courseCode: "INFO 2390" },
    create: {
      id: COURSE_COLLECTION_ID,
      userId: LUIGI_ID,
      name: "Introduction to Data Science",
      courseCode: "INFO 2390",
    },
  });

  // Link all decks to the course collection
  for (const deck of DECKS) {
    await prisma.collectionDeck.upsert({
      where: { collectionId_deckId: { collectionId: COURSE_COLLECTION_ID, deckId: deck.id } },
      update: {},
      create: { collectionId: COURSE_COLLECTION_ID, deckId: deck.id },
    });
  }
  console.log(`  Upserted course collection INFO 2390 with ${DECKS.length} decks`);

  console.log("Seed complete.");
  console.log(`  User: ${luigi.name} <${luigi.email}>`);
  console.log(`  API Key: ${LUIGI_API_KEY}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
