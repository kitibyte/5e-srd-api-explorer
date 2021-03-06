import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';

/**
 * @param {object} props
 * @param {string} props.href
 * @param {string} [props.as]
 * @param {React.ReactNode} props.children
 */
function NavLink({ href, as, children }) {
  const { asPath } = useRouter();

  return (
    <>
      <span className="opacity-50">/</span>
      <Link href={href} as={as}>
        {(as ?? href) === asPath ? (
          <a className="px-1" aria-current="page">
            {children}
          </a>
        ) : (
          <a className="px-1 transition-opacity duration-75 opacity-50 hover:opacity-100 focus:opacity-100">
            {children}
          </a>
        )}
      </Link>
    </>
  );
}

function Nav({ path }) {
  return (
    <nav className="mb-6 text-lg sm:text-xl">
      <NavLink href="/">home</NavLink>
      <NavLink href="/explore">explore</NavLink>

      {path?.map((part, i) => (
        <NavLink
          key={`${i}-${part}`}
          href="/explore/[...path]"
          as={[`/explore`, ...path.slice(0, i + 1)].join(`/`)}
        >
          {part.replace(/_/g, ` `)}
        </NavLink>
      ))}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="pt-8 pb-2 mt-8 text-sm text-center">
      © 2020{' '}
      <a
        className="underline whitespace-no-wrap"
        href="https://twitter.com/DavidJones418"
      >
        David Jones
      </a>
      {' · '}
      uses the{' '}
      <a
        className="underline whitespace-no-wrap"
        href="https://github.com/bagelbits/5e-database/"
      >
        D&amp;D 5th Edition API Database
      </a>
      {' · '}
      <a
        className="underline whitespace-no-wrap"
        href="https://github.com/DavidJones418/5e-srd-api-explorer"
      >
        source
      </a>
    </footer>
  );
}

/**@param {import('next/app').AppProps} props */
export default function App({ Component, pageProps }) {
  return (
    <div
      className="grid min-h-screen p-2 m-auto text-gray-900 bg-white grid-rows-layout"
      style={{
        fontFamily:
          'Literata, Georgia, Cambria, "Times New Roman", Times, serif',
      }}
    >
      <Head>
        <title>D&amp;D 5th Edition Data Explorer</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,700;1,400&display=swap"
        />
      </Head>

      <Nav {...pageProps} />

      <Component {...pageProps} />

      <Footer />
    </div>
  );
}
