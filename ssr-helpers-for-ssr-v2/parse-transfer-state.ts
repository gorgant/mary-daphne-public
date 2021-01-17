import { PRODUCTION_APPS, SANDBOX_APPS } from "shared-models/environments/env-vars.model";
import { PodcastEpisode } from "shared-models/podcast/podcast-episode.model";
import { BlogIndexPostRef } from "shared-models/posts/post.model";
import { PublicAppRoutes } from "shared-models/routes-and-paths/app-routes.model";
import { TransferStateKeys } from "shared-models/ssr/ssr-vars";

let productionEnvironment: boolean;

const unescapeHtml = (text: string) => {
  const unescapedText: any = {
      '&a;': '&',
      '&q;': '"',
      '&s;': '\'',
      '&l;': '<',
      '&g;': '>',
  };
  return text.replace(/&[^;]+;/g, (s) => unescapedText[s]);
}

// Locate the transfer state data in the HTML string and convert it to an object
export const parseTransferState = (htmlString: string, routeType: PublicAppRoutes, isProductionEnv: boolean): BlogIndexPostRef[] | PodcastEpisode[] => {

  // Set environment type before code runs
  productionEnvironment = isProductionEnv;

  console.log('Attempting to parse html doc');

  const appId: string = productionEnvironment ? PRODUCTION_APPS.mdlsPublicApp.projectId : SANDBOX_APPS.mdlsPublicApp.projectId;

  const scriptId = `${appId}-state`;

  
  console.log(`Parsing html doc using this script tag ${scriptId}`)

  const openingString = `${scriptId}" type="application/json">`;
  const closingString = `</script>`;

  const regex = new RegExp(`${openingString}(.*?)${closingString}`);

  console.log(`Using this regex to search: ${regex}`);

  try {
    const scriptContent = (htmlString.match(regex) as RegExpMatchArray)[1];

    console.log(`Found this script content`, scriptContent);

    let initialState = {};
    if (scriptContent.length > 0) {
        try {
            initialState = JSON.parse(unescapeHtml(scriptContent));
            
        }
        catch (e) {
            console.warn('Exception while restoring TransferState for app ' + appId, e);
        }
    }

    let dataKey;
    let dataArray;

    // Return the data specific to the data key
    switch (routeType) {
      case PublicAppRoutes.BLOG:
        dataKey = TransferStateKeys.BLOG_INDEX_KEY;
        dataArray = (initialState as any)[dataKey] as BlogIndexPostRef[];
        console.log(`Found this data in blog post`, dataArray);
        return dataArray;
      case PublicAppRoutes.PODCAST:
        dataKey = TransferStateKeys.ALL_PODCAST_EPISODES_KEY;
        dataArray = (initialState as any)[dataKey] as PodcastEpisode[];
        console.log(`Found this data in podcast`, dataArray);
        return dataArray;
      default:
        dataKey = '';
        console.log(`No data found in html`, dataArray);
        return [];
    }

  } catch (e) {
    console.log(`Error parsing HTML for script content:`, e);
    return e;
  }
  

  
}