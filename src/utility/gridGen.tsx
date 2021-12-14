import { chunk } from "lodash";
import * as React from "react";
import { Col, Row, Grid } from "react-flexbox-grid";

interface IGridGeneratorProps {
  cols: 1 | 2 | 3 | 4 | 6 | 12;
}

export default class GridGenerator extends React.Component<IGridGeneratorProps, {}> {
  colWidth: number;
  rows: any;

  constructor(props: IGridGeneratorProps) {
    super(props);
    this.colWidth = 12 / props.cols;
    this.rows = chunk(
      React.Children.toArray(this.props.children),
      this.props.cols
    );
  }

  render() {
    return (
      <Grid>
        {this.rows.map((cols : any) => (
          <Row>
            {cols.map((col : any) => (
              <Col sm={12} md={this.colWidth}>
                {col}
              </Col>
            ))}
          </Row>
        ))}
      </Grid>
    );
  }
}
