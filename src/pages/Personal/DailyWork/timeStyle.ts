import { createStyles } from 'antd-style';

export default function timeStyle(status) {
  let frontColor;
  if (status === 'DONE') {
    frontColor = '#6294a5';
  } else {
    frontColor = '#81d3f8';
  }
  return createStyles(({ css }) => ({
    line: css`
      background-color: ${frontColor};
      height: 2px;
      border: none;
      margin: 12px 0 0 0;
    `,
    time: css`
      width: 70px;
      height: 25px;
      border: 1.5px solid ${frontColor};
      border-radius: 5px;
      background-color: ${frontColor};
      color: #ffffff;
      padding: 0;

      :hover {
        color: ${frontColor};
        border-color: ${frontColor};
      }

      .ant-picker-input {
        input {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          padding-left: 2px;
        }

        input::placeholder {
          position: relative;
          top: -2px;
          color: #ffffff;
          font-size: 14px;
        }

        input:hover::placeholder {
          color: ${frontColor};
        }

        .aria-invalid {
          color: ${frontColor};
        }

        .anticon {
          display: none;
        }
      }
    `,
  }))();
}
