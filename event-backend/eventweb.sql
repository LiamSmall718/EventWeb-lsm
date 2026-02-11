--
-- PostgreSQL database dump
--

\restrict qlB9XS2NNTNSweiyxPzH1LBiLkAAuoVFLjxrhv2f9HcIFyPA4wkwZgttjFTcDEk

-- Dumped from database version 15.15 (Homebrew)
-- Dumped by pg_dump version 15.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_owner_id_fkey;
ALTER TABLE IF EXISTS ONLY public.event_registrations DROP CONSTRAINT IF EXISTS event_registrations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.event_registrations DROP CONSTRAINT IF EXISTS event_registrations_event_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_pkey;
ALTER TABLE IF EXISTS ONLY public.event_registrations DROP CONSTRAINT IF EXISTS event_registrations_pkey;
ALTER TABLE IF EXISTS public.events ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP SEQUENCE IF EXISTS public.events_id_seq;
DROP TABLE IF EXISTS public.events;
DROP TABLE IF EXISTS public.event_registrations;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_registrations (
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title text NOT NULL,
    date date NOT NULL,
    location text NOT NULL,
    owner_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    capacity integer DEFAULT 10
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_registrations (event_id, user_id, created_at) FROM stdin;
13	5	2026-02-10 21:22:40.783595
15	5	2026-02-11 17:19:55.439402
10	5	2026-02-11 17:46:57.602553
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, title, date, location, owner_id, created_at, capacity) FROM stdin;
4	event	2026-03-14	centrale	9	2026-01-23 10:42:41.171267+01	10
10	milo	2026-12-31	centrale	8	2026-02-05 10:43:28.157603+01	1
13	milo3	2026-02-12	Centrale	5	2026-02-06 08:16:35.422335+01	1000
14	Event	2026-02-07	Centrale	5	2026-02-06 11:59:58.853729+01	10
15	Event Test	2026-02-18	Centrale	5	2026-02-10 21:23:17.722776+01	105
16	Révision	2026-02-12	E242	5	2026-02-10 21:49:26.524942+01	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password) FROM stdin;
1	test_ok	hash
2	test123	$2b$10$DqCcDByovJRDzdMJzQuaYuyAo4nsBMxAhx9QmlW/NAHLBdWZxDHla
3	user	$2b$10$BUVmPvvInARaElUsacDZdORiVswnpIbxFNzy5.8ixl7meCYGM.f5i
4	user123	$2b$10$.c4MG77iWZPxqO7oOUyRO.V3tupsLCqefWB1NutgWYEBjPj82wRkW
5	milo	$2b$10$3LUdgsZBDqyT6jZxEgSAAeEQAwzauKP0r7zeREf/rcWJgJT8TEb7m
6	milo2	$2b$10$SzUL67spdDbkaQwnElXpi.02EZjTpeZYP2Rc.80TgFbPzE5hO9TN2
7	nico	$2b$10$i8yhLow5tRpZXv.Oq5zfj.vyxeqW8tBmb6MHJdYtntyo7lGZosYsa
8	omar	$2b$10$TNzcGvU7HOtPmIfWArATVOSLA/e/7.o2OaF3A3jlOJpdnwgzZIKwK
9	user4	$2b$10$MhwkFUIyo2fZSNzJnxqiSeyPrP23KeaHQJSsUhnLC7vMPrDSyiQ/2
10		$2b$10$b0WyEMiwxCvHzu2rh7Ic1eIXeXST5QvGXRtQWnNzQYVPTFc4PzlUa
11	miloooo	$2b$10$HKuaD9gFyGteVy.VTHOxNeptCC8u/qI/dLa55n9V.Ztv41p8Rz8VS
\.


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_id_seq', 18, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (event_id, user_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: event_registrations event_registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_registrations event_registrations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: events events_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict qlB9XS2NNTNSweiyxPzH1LBiLkAAuoVFLjxrhv2f9HcIFyPA4wkwZgttjFTcDEk

