import {
  ChoiceField,
  ModuleFields,
  RepeatedFieldGroup,
  TextField,
} from '@hubspot/cms-components/fields';

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
        default: 6,
      }}
      default={[
        {
          year: '2015',
          content: 'Radientum was founded in 2015 by a group of antenna engineers with a vision to enable optimal antenna performance for products in all industries.',
          contentSide: 'right',
        },
        {
          year: '2016',
          content: 'The year 2016 was a period of developing our internal processes to deliver value while working in customer projects.',
          contentSide: 'left',
        },
        {
          year: '2017',
          content: 'At the start of 2017, management experience was strengthened and customer projects expanded internationally.',
          contentSide: 'right',
        },
        {
          year: '2018',
          content: '2018 was a year of rapid growth where previous efforts started to pay off in production and service projects.',
          contentSide: 'left',
        },
        {
          year: '2019',
          content: '2019 was a year of stable and profitable growth leading to increased revenues and stronger customer partnerships.',
          contentSide: 'right',
        },
        {
          year: '2020',
          content: 'During 2020, despite disruptions, the team kept developing capabilities and invested in internal transformation.',
          contentSide: 'left',
        },
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
        label="Card side"
        name="contentSide"
        display="radio"
        choices={[
          ['left', 'Left'],
          ['right', 'Right'],
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
  </ModuleFields>
);
