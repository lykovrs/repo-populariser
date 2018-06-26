import React from "react";
import { shallow, mount } from "enzyme";
import ReportTable from "./index";
import LinearProgress from "@material-ui/core/LinearProgress";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import store from "../../redux";
import { theme } from "../../Root";

Enzyme.configure({ adapter: new Adapter() });

it("should render loader", () => {
  const container = shallow(<ReportTable store={store} />);
  expect(container.contains(<LinearProgress />));
});
it("it should render report list", () => {
  const testEvents = [];
  for (let i = 0; i < 100; i++) {
    testEvents.push({
      time: `${i}:00`,
      eventid: `id_${i}`,
      eventname: "Helmet",
      picture:
        i % 2
          ? ""
          : "http://rusvesna.su/sites/default/files/styles/orign_wm/public/kot_14.jpg"
    });
  }
  const container = shallow(
    <ReportTable
      items={testEvents}
      fetchReport={() => {}}
      messages={[]}
      loading={false}
      classes={{}}
      clearReport={() => {}}
      clearReportMessage={() => {}}
      exportTo={() => {}}
    />
  );

  const rows = container.find(".test-row-report-items");
  expect(rows.length).toEqual(testEvents.length);
});
// it('it should render report list', () => {
//   const container = mount(
//     <Provider store={store}>
//       <MuiThemeProvider theme={theme}>
//         <ReportTable />
//       </MuiThemeProvider>
//     </Provider>
//   );
//   expect(container.contains(<LinearProgress />));
// })
