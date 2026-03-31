import {
  ChoiceField,
  ModuleFields,
  RepeatedFieldGroup,
  TextField,
} from '@hubspot/cms-components/fields';
import StyleFields from './styleFields.js';

export const fields = (
  <ModuleFields>
    <TextField
      label="Start year"
      name="timelineStartYear"
      default="2015"
      inlineEditable={true}
    />
    <RepeatedFieldGroup
      label="Timeline entries"
      name="groupTimelineEntries"
      occurrence={{
        min: 1,
        max: 20,
        default: 8,
      }}
      default={[
        {
          year: '2015',
          content: 'Radientum was founded in 2015 by a group of ex-Nokia antenna engineers with a vision to enable optimal antenna performance for products in all industries. We set out to provide the access to antenna engineering resources and tools such as simulation environment and antenna laboratory on a need-to-use basis.',
          contentSide: 'right',
        },
        {
          year: '2016',
          content: 'The year 2016 was a period of developing our internal processes to be agile while working on customer projects. Since our foundation, we have always been working for our customers and learning continuously how to provide even better services.',
          contentSide: 'left',
        },
        {
          year: '2017',
          content: 'At the start of 2017, we got a new CEO when Jukka Sjöstedt joined our team. He brought management experience from competitive international business and set out to make us truly international. During the spring we set up our OTA measurement chamber to provide a wider range of services. October 2017 was the month when we had a booth at an exhibition for the first time outside of Finland.',
          contentSide: 'right',
        },
        {
          year: '2018',
          content: '2018 was a year of rapid growth where 2017 efforts started to pay off almost doubling our revenue. The year saw changes in ownership and recruitment of engineering resources to fulfill customer demand.',
          contentSide: 'left',
        },
        {
          year: '2019',
          content: '2019 was a year of stable and profitable growth leading to about 874k€ revenue with 108k€ profit. We continued recruitments and our board of directors was joined by two board professionals. By the end of 2019, we had already served 113 customers in 24 countries such as the USA, UK, Germany, Finland, France, Spain, Canada, etc. 2019 was also the year we started our first research project together with universities and other industry partners.',
          contentSide: 'right',
        },
        {
          year: '2020',
          content: 'Corona affected our customers severely in 2020 which therefore had an effect on us as well followed by supply chain problems in 2021. During these years we focused on developing our capabilities. 2021 was the year we initiated our second research project, this time with an international consortium.',
          contentSide: 'left',
        },
        {
          year: '2022',
          content: 'The year 2022 has been a year of changes as we passed 2 million in revenue. It meant establishing our second office in Espoo, Finland, and bringing in several more people to the Radientum team.',
          contentSide: 'right',
        },
        {
          year: '2023',
          content: 'In 2023, Radientum made its first acquisition by purchasing TreSolver Oy.',
          contentSide: 'left',
        }
      ]}
    >
      <TextField label="Year" name="year" default="2015" inlineEditable={true} />
      <TextField
        label="Text"
        name="content"
        default="Write timeline item text"
        inlineEditable={true}
      />
      <ChoiceField
        label="Paragraph card side"
        name="contentSide"
        display="radio"
        helpText="Right: styled card with paragraph on the right, notch points left toward the line. Left: styled card on the left, notch points right. The other side shows the year only (bold, no card frame)."
        choices={[
          ['right', 'Right'],
          ['left', 'Left'],
        ]}
        default="right"
      />
    </RepeatedFieldGroup>
    <TextField
      label="End year"
      name="timelineEndYear"
      default="Now"
      inlineEditable={true}
    />
    <StyleFields />
  </ModuleFields>
);
