import { PubSub } from '@google-cloud/pubsub';
import { adminProjectId } from '../config/environments-config';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';
import { WebpageLoadFailureData } from '../../../shared-models/ssr/webpage-load-failure-data.model';
const pubSub = new PubSub();

export const transmitWebpageLoadFailureDataToAdmin = async (webpageLoadFailureData: WebpageLoadFailureData ) => {

  console.log('Transmit webpage load failure data received with this data', webpageLoadFailureData);

  const projectId = adminProjectId;
  const topicName = AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC;
  const emailCategory = EmailCategories.WEBPAGE_DATA_LOAD_FAILURE;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    emailCategory,
    webpageLoadFailureData
  }
  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {console.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); return err;});
  console.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, topicPublishRes);
  
  return topicPublishRes;
}