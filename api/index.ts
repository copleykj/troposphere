import { Meteor } from 'meteor/meteor';
import { executeLinks } from 'meteor/copleykj:grapher-link-executor';

export * from './Packages';
export * from './LatestPackages';
export * from './ReleaseVersions';
export * from './Versions';

Meteor.startup(() => {
  executeLinks();
});
