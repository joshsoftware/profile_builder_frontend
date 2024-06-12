import React from "react";
import { Button, Col, Image, Row, Typography } from "antd";
import resumeSvg from "../../assets/banner.svg";
import styles from "./Dashboard.module.css";

const { Title, Text } = Typography;

const Dashboard = () => {
  return (
    <Row className={styles.container} align="middle" justify="center">
      <Col>
        <Image src={resumeSvg} alt="Resume" preview={false} />
        <Title level={2} className={styles.heading}>
          A <Text strong>Profile</Text> that Stands Out! Make Your Own Profile
          and
          <Text strong> Download as PDF.</Text>
        </Title>
        <Button type="primary" className={styles.createBtn}>
          Create My Resume
        </Button>
      </Col>
    </Row>
  );
};

export default Dashboard;
