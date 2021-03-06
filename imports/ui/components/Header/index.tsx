import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import gravatar from 'gravatar';
import { Link, useHistory } from 'react-router-dom';
import { Search, Login } from 'heroicons-react';
import useLocationQuery from '../../hooks/useLocationQuery';
import { useTracker } from 'meteor/react-meteor-data';

const links = [
  { title: 'About Us', url: 'https://meteorjs.community', external: true },
  { title: 'Packages', url: '/communitypackages' },
  { title: 'People', url: 'https://github.com/orgs/Meteor-Community-Packages/people', external: true },
  { title: 'GitHub', url: 'https://github.com/Meteor-Community-Packages', external: true },
  { title: 'Slack', url: 'https://tinyurl.com/mcg-slack', external: true },
];

const HeaderComponent = (): JSX.Element => {
  const [locationQuery, setLocationQuery] = useLocationQuery();
  const q = typeof locationQuery.q === 'string' ? locationQuery.q : '';
  const [searchState, setSearchState] = useState(q);

  const history = useHistory();
  useEffect(() => {
    // XXX - Figure out how to type this nightmare.
    const unlisten = history.listen(({ action, location }: any) => {
      setTimeout(() => {
        if (action !== 'POP') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      });
    });

    return () => { unlisten(); };
  }, []);

  const user = useTracker(() => {
    return Meteor.user();
  });

  const userImage = gravatar.url(user?.services?.['meteor-developer'].emails[0].address, { s: '100', r: 'pg', d: 'https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png' }, true);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchState.length > 0) {
      setLocationQuery({ path: '/search', params: { q: searchState } });
    }
  };
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setSearchState(e.target.value);
  };
  const loginHandler = (): void => {
    Meteor.loginWithMeteorDeveloperAccount();
  };
  return (
    <header className="px-4 bg-gradient-to-t from-blueGray-800 to-blueGray-900">
      <div className="flex justify-center md:justify-end container m-auto py-5">
        <ul className="flex space-x-5">
          {links.map(link => (
            <li key={link.title}>
              {typeof link.external === 'undefined'
                ? <Link to={link.url}>{link.title}</Link>
                : <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
              }
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-8 pb-4 flex flex-col lg:flex-row container space-y-10 lg:space-y-0 m-auto justify-between items-center">
        <Link to="/" className="flex items-center space-x-5">
          <span className="flex-shrink-0 p-1.5 from-yellow-600 via-yellow-500 to-yellow-400 bg-gradient-to-tl rounded-full inline-flex">
            <img
              src="https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png"
              alt="Meteor Community Logo"
              className="w-20 rounded-full ring-white ring-2"
            />
          </span>
          <div className="flex flex-col">
            <p className="text-sm">Meteor Community</p>
            <p className="text-3xl font-semibold">Packosphere</p>
          </div>
        </Link>
        <div className="flex items-center space-x-5">
          <span className="from-yellow-700 to-yellow-600 bg-gradient-to-t rounded-md flex-shrink py-1 px-6 pr-4 inline-flex lg:flex-grow items-center">
            <form onSubmit={submitHandler} className="flex items-center" autoComplete="off">
              <input type="text" name='search' autoFocus onChange={changeHandler} value={searchState} className="bg-transparent outline-none w-full text-white flex-grow flex-shrink text-xl placeholder-gray-100" placeholder="Search Packages" />
              <button className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full focus:outline-none focus:bg-yellow-600 hover:bg-yellow-600" aria-label="Search">
                <Search size={18} />
              </button>
            </form>
          </span>
          <div className="flex items-center justify-center flex-shrink-0">
            {Meteor.userId() !== null
              ? <img src={userImage} alt={`${user?.profile.name}'s Avatar`} className="w-11 h-11 rounded-full ring-2 ring-yellow-600 ring-offset-2 flex-shrink-0" />
              : <button onClick={loginHandler} title="Log In" className="flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-blueGray-500 bg-blueGray-600 flex-shrink-0 focus:outline-none" >
                <Login size={22} />
              </button>
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
