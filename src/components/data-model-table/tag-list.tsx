import { Tag } from 'antd';

/**
 * Creates a list of tags based off a list of strings
 */
export const TagList = (props: { items: string[] | undefined | null }) => {
  const { items } = props;
  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item) => <Tag>{item}</Tag>);
};
