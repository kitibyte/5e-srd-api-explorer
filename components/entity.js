import NextLink from 'next/link';
import { Fragment, useState } from 'react';

function Loading() {
  return (
    <p>
      Loading...
      <style jsx>{`
        color: lightgray;
        font-style: italic;
      `}</style>
    </p>
  );
}

/**@param {{ data: object, url: string, level: number }} props */
function Category({ data, url, level }) {
  return (
    <ul>
      {Object.entries(data).map(([key, { href, name, description }]) => {
        return (
          <li key={key}>
            <Record
              data={{ href, name, description }}
              url={`${url}/${key}`}
              level={level + 1}
            />
          </li>
        );
      })}

      <style jsx>{`
        li:not(:first-child) {
          padding-top: 0.5rem;
        }
        li:not(:last-child) {
          padding-bottom: 0.5rem;
          border-bottom: 1px solid lightgray;
        }
      `}</style>
    </ul>
  );
}

/**@param {{ data: unknown[], url: string, level: number }} props */
function List({ data: items, url, level }) {
  return (
    <>
      <ul>
        {items.map((item, key) => (
          <li key={key}>
            <Entity data={item} url={`${url}/${key}`} level={level + 1} />
          </li>
        ))}
      </ul>

      <style jsx>{`
        li:not(:first-child) {
          padding-top: 0.5rem;
        }
        li:not(:last-child) {
          padding-bottom: 0.5rem;
          border-bottom: 1px solid lightgray;
        }
      `}</style>
    </>
  );
}

/**@param {{ data: object, url: string, level: number }} props */
function Record({ data: allData, url, level }) {
  const { name, description, href = url, ...data } = allData;

  const entries = Object.entries(data);

  return (
    <>
      <NextLink href="/[...page]" as={href}>
        <a>
          <h3>
            {name ||
              data.class?.name ||
              data.class ||
              data.damage_type?.name ||
              data.dc_type?.name ||
              href.slice(href.lastIndexOf(`/`) + 1)}
          </h3>
          {description &&
            description
              .split(`\n`)
              .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </a>
      </NextLink>

      {entries.length > 0 && (
        <dl>
          {entries.map(([key, value]) => (
            <Fragment key={key}>
              <dt className={key === 'error' ? 'error' : undefined}>
                <NextLink href="/[...page]" as={`${url}/${key}`}>
                  <a>{key}</a>
                </NextLink>
                :
              </dt>

              <dd className={key === 'error' ? 'error' : undefined}>
                <Entity data={value} url={`${url}/${key}`} level={level + 1} />
              </dd>
            </Fragment>
          ))}
        </dl>
      )}

      <style jsx>{`
        h3 {
          font-weight: 700;
        }
        p {
          margin-top: 0.5rem;
        }
        a + dl {
          margin-top: 1rem;
        }
        dt {
          font-weight: 700;
          margin-top: 1rem;
        }
        dd {
          padding-left: 2rem;
          margin-top: 1rem;
        }
        @media (min-width: 640px) {
          dl {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-row-gap: 1rem;
            grid-column-gap: 1rem;
          }
          dt {
            grid-column: 1;
            margin-top: 0;
          }
          dd {
            grid-column: 2;
            padding-left: 0;
            margin-top: 0;
          }
        }
        .error {
          color: crimson;
        }
      `}</style>
    </>
  );
}

/**@param {{ data: string }} props */
function Link({ data }) {
  return (
    <p>
      <NextLink href="/[...page]" as={data}>
        <a>{data}</a>
      </NextLink>

      <style jsx>{`
        a {
          text-decoration: underline;
        }
      `}</style>
    </p>
  );
}

/**@param {{ data: unknown }} props */
function Value({ data }) {
  return (
    <>
      {String(data)
        .split(`\n`)
        .filter(Boolean)
        .map((line, i) => (
          <p key={i}>{line}</p>
        ))}

      <style jsx>{`
        p:not(:last-child) {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  );
}

/**
 * @param {{ data: unknown, url: string, level?: number }} props
 */
export default function Entity({ data, url, level = 0 }) {
  if (url.endsWith(`/`)) {
    url = url.slice(0, -1);
  }

  if (data === undefined) {
    return <Loading />;
  } else if (/^\/api(?:\/[^/]+)?$/.test(url)) {
    return <Category data={data} url={url} level={level} />;
  } else if (Array.isArray(data)) {
    return <List data={data} url={url} level={level} />;
  } else if (typeof data === 'object') {
    return <Record data={data} url={url} level={level} />;
  } else if (typeof data === 'string' && data.startsWith('/api/')) {
    return <Link data={data} />;
  } else {
    return <Value data={data} />;
  }
}
